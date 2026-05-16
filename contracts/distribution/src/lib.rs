//! Acre Distribution Contract
//! Uses a rent-per-token accumulator so yield is correctly attributed to
//! the tokens held at the time of each deposit, not retroactively.

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol};

#[contracttype]
pub enum DataKey {
    Admin,
    StablecoinContract,
    /// Cumulative rent deposited per token (scaled by PRECISION)
    RentPerToken,
    /// Per-holder snapshot of RentPerToken at last claim
    Checkpoint(Address),
}

const PRECISION: i128 = 1_000_000_000_000;

#[contract]
pub struct DistributionContract;

#[contractimpl]
impl DistributionContract {
    pub fn initialize(env: Env, admin: Address, stablecoin_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::StablecoinContract, &stablecoin_contract);
        env.storage().instance().set(&DataKey::RentPerToken, &0_i128);
    }

    /// Admin deposits rent. `total_token_supply` must be the live supply at deposit time.
    pub fn deposit_rent(env: Env, amount: i128, total_token_supply: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        if amount <= 0 || total_token_supply <= 0 {
            panic!("invalid amount or supply");
        }

        let stablecoin: Address = env.storage().instance().get(&DataKey::StablecoinContract).unwrap();
        token::Client::new(&env, &stablecoin).transfer(&admin, &env.current_contract_address(), &amount);

        let prev_rpt: i128 = env.storage().instance().get(&DataKey::RentPerToken).unwrap_or(0);
        let delta = (amount * PRECISION) / total_token_supply;
        env.storage().instance().set(&DataKey::RentPerToken, &(prev_rpt + delta));

        env.events().publish((Symbol::new(&env, "rent_deposited"),), amount);
    }

    /// Holder claims yield accrued since their last checkpoint.
    pub fn claim(env: Env, holder: Address, holder_balance: i128) {
        holder.require_auth();
        let claimable = Self::claimable(env.clone(), holder.clone(), holder_balance);
        if claimable <= 0 {
            panic!("nothing to claim");
        }

        let stablecoin: Address = env.storage().instance().get(&DataKey::StablecoinContract).unwrap();
        token::Client::new(&env, &stablecoin).transfer(&env.current_contract_address(), &holder, &claimable);

        let rpt: i128 = env.storage().instance().get(&DataKey::RentPerToken).unwrap_or(0);
        env.storage().instance().set(&DataKey::Checkpoint(holder.clone()), &rpt);

        env.events().publish((Symbol::new(&env, "yield_claimed"),), claimable);
    }

    pub fn claimable(env: Env, holder: Address, holder_balance: i128) -> i128 {
        let rpt: i128 = env.storage().instance().get(&DataKey::RentPerToken).unwrap_or(0);
        let checkpoint: i128 = env.storage().instance().get(&DataKey::Checkpoint(holder)).unwrap_or(0);
        (holder_balance * (rpt - checkpoint)) / PRECISION
    }
}
