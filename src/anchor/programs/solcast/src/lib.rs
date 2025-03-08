use anchor_lang::prelude::*;

use elfo_protocol_core::cpi::accounts::CreateSubscriptionPlan;
use elfo_protocol_core::program::ElfoProtocol;
use elfo_protocol_core::state::{Protocol};
use spl_discriminator::SplDiscriminate;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

declare_id!("HWNpieZscUsPMR2RjnHBPy8Crp4ziy67gNzGKWuGmXeW");

pub const MAXIMUM_CREATOR_ACCOUNTS: usize = 50;
pub const MAXIMUM_POSTS_PER_CREATOR: usize = 30;
pub const ANCHOR_DISCRIMINATOR: usize = 8;

#[program]
pub mod solcast {

    use super::*;

    pub fn init(ctx: Context<Initialize>) -> Result<()> {
        let solcast_state = &mut ctx.accounts.solcast_state;
        solcast_state.bump = ctx.bumps.solcast_state;
        solcast_state.has_already_been_initialized = true;
        solcast_state.authority = ctx.accounts.authority.key();
        solcast_state.creator_accounts = vec![];
        Ok(())
    }

    pub fn init_creator(
        ctx: Context<InitializeCreator>,
        creator_name: String,
        creator_amount: i64,
        creator_data_id: String,
    ) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        creator.bump = ctx.bumps.creator;
        creator.has_already_been_initialized = true;
        creator.authority = ctx.accounts.authority.key();
        creator.name = creator_name.clone();
        creator.data_id = creator_data_id;
        creator.last_post_index = 0;
        
        // create subscription plan for creator
        let cpi_program = ctx.accounts.protocol.to_account_info();

        let cpi_accounts = CreateSubscriptionPlan {
            token_program: ctx.accounts.token_program.to_account_info(),
            associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            protocol_state: ctx.accounts.protocol_state.to_account_info(),
            subscription_plan_payment_account: ctx.accounts.creator_payment_account.to_account_info(),
            subscription_plan: ctx.accounts.subscription_plan.to_account_info(),
            subscription_plan_author: ctx.accounts.subscription_plan_author.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        elfo_protocol_core::cpi::create_subscription_plan(
            cpi_ctx,
            creator_name,
            creator_amount,
            30 * 86400,
            2,
        )?;

        creator.subscription_plan = ctx.accounts.subscription_plan.key();

        let state = &mut ctx.accounts.grantive_state;
        state.creator_accounts.push(creator.key());
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>,title: String, content_data: String, subscriber_only: bool) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        let post = &mut ctx.accounts.post;
        post.bump = ctx.bumps.post;
        post.has_already_been_initialized = true;
        post.title = title;
        post.content_data = content_data;
        post.creator = creator.key();
        post.subscriber_only = subscriber_only;

        let clock = &ctx.accounts.clock;
        let current_time = clock.unix_timestamp;

        post.published_on = current_time;

        creator.posts.push(post.key());
        creator.last_post_index = creator.last_post_index + 1;
        post.index = creator.last_post_index;
        

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, content_data: String)]
pub struct CreatePost<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [b"post", creator.key().as_ref(), (creator.last_post_index + 1).to_string().as_ref()],
        bump,
        space= ANCHOR_DISCRIMINATOR + CreatorPost::INIT_SPACE,
    )]
    pub post: Box<Account<'info, CreatorPost>>,

    #[account(
        mut,
        seeds = [b"creator", authority.key().as_ref()],
        bump = creator.bump,
        has_one = authority,
        constraint = creator.has_already_been_initialized @CreatorNotInitialized
    )]
    pub creator: Box<Account<'info, Creator>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub clock: Sysvar<'info, Clock>,
}


#[derive(Accounts)]
#[instruction(creator_name: String, creator_amount: i64, creator_data_id: String)]
pub struct InitializeCreator<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [b"creator", authority.key().as_ref()],
        bump,
        space= ANCHOR_DISCRIMINATOR + Creator::INIT_SPACE,
    )]
    pub creator: Box<Account<'info, Creator>>,

    #[account( 
        mut, 
        seeds = [b"solcast_state"],
        bump = solcast_state.bump,
        constraint = solcast_state.has_already_been_initialized
    )]
    pub solcast_state: Box<Account<'info, Solcast>>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint,
        associated_token::authority = authority,
    )]
    pub creator_payment_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub protocol_state: Box<Account<'info, Protocol>>,

    #[account(mut)]
    /// CHECK is checked on CPI call to elfo protocol
    pub subscription_plan: UncheckedAccount<'info>,

    #[account(mut)]
   /// CHECK is checked on CPI call to elfo protocol
    pub subscription_plan_author: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(address = mint::USDC @ ErrorCode::InvalidMint)]
    pub mint: Box<Account<'info, Mint>>,
    
    pub protocol: Program<'info, ElfoProtocol>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [b"solcast_state"],
        bump,
        space= ANCHOR_DISCRIMINATOR + Solcast::INIT_SPACE,
    )]
    pub solcast_state: Box<Account<'info, Solcast>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(InitSpace, SplDiscriminate)]
#[discriminator_hash_input("solcast_state")]
pub struct Solcast {
    pub bump: u8,
    pub has_already_been_initialized: bool,
    pub authority: Pubkey,
    pub creator_accounts: [CreatorAccount; MAXIMUM_CREATOR_ACCOUNTS],
}

#[account]
#[derive(InitSpace, SplDiscriminate)]
#[discriminator_hash_input("creator")]
pub struct Creator {
    pub bump: u8,
    pub has_already_been_initialized: bool,
    pub authority: Pubkey,
    #[max_len(64)]
    pub name: String,
    #[max_len(100)]
    pub data_id: String,
    pub subscription_plan: Pubkey,

    pub posts: [Pubkey; MAXIMUM_POSTS_PER_CREATOR],
    pub last_post_index: i64,
}

#[account]
#[derive(InitSpace, SplDiscriminate)]
#[discriminator_hash_input("post")]
pub struct CreatorPost {
    pub bump: u8,
    pub index: i64,
    pub has_already_been_initialized: bool,
    pub creator: Pubkey,
    #[max_len(64)]
    pub title: String,
    #[max_len(256)]
    pub content_data: String,
    pub published_on: i64,

    pub subscriber_only: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Creator is not initialized.")]
    CreatorNotInitialized,
}
