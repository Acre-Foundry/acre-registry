//! Acre Token Contract — SEP-41 fungible token for fractional vault ownership.

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
pub enum DataKey {
    Balance(Address),
    Allowance(Address, Address),
    TotalSupply,
    Admin,
    Name,
    Symbol,
}

#[contract]
pub struct AcreToken;

#[contractimpl]
impl AcreToken {
    pub fn initialize(env: Env, admin: Address, supply: i128, name: String, symbol: String) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
        env.storage().instance().set(&DataKey::TotalSupply, &supply);
        env.storage().instance().set(&DataKey::Balance(admin.clone()), &supply);
    }

    pub fn name(env: Env) -> String {
        env.storage().instance().get(&DataKey::Name).unwrap()
    }

    pub fn symbol(env: Env) -> String {
        env.storage().instance().get(&DataKey::Symbol).unwrap()
    }

    pub fn decimals(_env: Env) -> u32 {
        7
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
    }

    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage().instance().get(&DataKey::Balance(account)).unwrap_or(0)
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        assert!(amount > 0, "amount must be positive");
        let from_bal = Self::balance(env.clone(), from.clone());
        assert!(from_bal >= amount, "insufficient balance");
        env.storage().instance().set(&DataKey::Balance(from), &(from_bal - amount));
        let to_bal = Self::balance(env.clone(), to.clone());
        env.storage().instance().set(&DataKey::Balance(to), &(to_bal + amount));
    }

    pub fn approve(env: Env, owner: Address, spender: Address, amount: i128) {
        owner.require_auth();
        env.storage().instance().set(&DataKey::Allowance(owner, spender), &amount);
    }

    pub fn allowance(env: Env, owner: Address, spender: Address) -> i128 {
        env.storage().instance().get(&DataKey::Allowance(owner, spender)).unwrap_or(0)
    }

    /// Spender transfers on behalf of `from`. Only spender auth required — does NOT
    /// call `transfer()` internally to avoid demanding `from`'s auth a second time.
    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        spender.require_auth();
        let allowance = Self::allowance(env.clone(), from.clone(), spender.clone());
        assert!(allowance >= amount, "insufficient allowance");
        assert!(amount > 0, "amount must be positive");
        let from_bal = Self::balance(env.clone(), from.clone());
        assert!(from_bal >= amount, "insufficient balance");
        env.storage().instance().set(&DataKey::Allowance(from.clone(), spender), &(allowance - amount));
        env.storage().instance().set(&DataKey::Balance(from), &(from_bal - amount));
        let to_bal = Self::balance(env.clone(), to.clone());
        env.storage().instance().set(&DataKey::Balance(to), &(to_bal + amount));
    }
}
