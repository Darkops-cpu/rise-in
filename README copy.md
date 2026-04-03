# TossBet 🪙

TossBet is a premium, decentralized coin toss betting application built on the Stellar network using Soroban smart contracts. It provides a transparent and fair gaming experience with instant settlement and deep wallet integration.

## 🌟 Project Vision
Our vision is to showcase the potential of the Stellar ecosystem for creating high-performance, visually stunning, and decentralized games of chance. By leveraging Soroban's speed and security, TossBet offers a frictionless experience that bridges the gap between traditional gaming and blockchain transparency.

## 🚀 Key Features
- **Instant Wallet Connectivity**: Seamless integration with the Freighter wallet for real-time interaction.
- **Cryptographic Intent**: Every bet requires a secure digital signature, ensuring user authorization and data integrity.
- **Fair Randomized Odds**: A robust backend logic provides unbiased 50/50 outcomes for every toss.
- **Premium User Experience**: A modern, responsive interface built with glassmorphism aesthetics and smooth micro-animations.
- **On-Chain Transparency**: All contract interactions and deployments are verifiable on the Stellar Testnet.

---

## 📜 Deployed Smartcontract Details
The core logic is deployed on the Stellar Testnet. You can verify the contract details and history on the block explorer.

- **Contract ID**: `CC6XIG7S7IFC3GWTAOXF6JQTMAATNO3FFZZ2Q564SHSR755VER3WJ7NI`
- **Block Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CC6XIG7S7IFC3GWTAOXF6JQTMAATNO3FFZZ2Q564SHSR755VER3WJ7NI)

### Contract Deployment Screenshot
![Stellar Expert Contract Details](file:///run/media/dark/New%20Volume/RiseIn/toss-bet/docs/Screenshot%20From%202026-04-03%2015-57-51.png)

---

## 🖼️ UI Screenshots

| Winning Outcome | Losing Outcome |
| :---: | :---: |
| ![You Won Heads](file:///run/media/dark/New%20Volume/RiseIn/toss-bet/docs/Screenshot%20From%202026-04-03%2016-04-38.png) | ![Bad Luck Outcome](file:///run/media/dark/New%20Volume/RiseIn/toss-bet/docs/Screenshot%20From%202026-04-03%2016-04-23.png) |

### Wallet Interaction (Freighter)
![Freighter Confirm Transaction](file:///run/media/dark/New%20Volume/RiseIn/toss-bet/docs/Screenshot%20From%202026-04-03%2016-04-32.png)

---

## 💻 Project Setup Guide

### Prerequisites
- **Rust & Cargo** (Latest stable version)
- **Stellar CLI** (For contract deployment)
- **Python 3** (For local frontend serving)
- **Freighter Wallet Extension**

### 1. Backend Setup
Navigate to the `backend` directory and start the prediction server:
```bash
cd backend
cargo run
```
The server will run on `http://127.0.0.1:8080`.

### 2. Frontend Setup
Navigate to the `frontend` directory and start a local web server:
```bash
cd frontend
python3 -m http.server 8001
```
Access the application at `http://localhost:8001`.

---

## 🔮 Future Scope
- **On-Chain Randomness**: Transitioning result generation to Verifiable Random Functions (VRF) directly on the Soroban smart contract.
- **Stellar Asset Support**: Enabling bets in any Stellar-based asset (USDC, EURC, etc.) via liquidity pool integration.
- **Social Features**: Implementing decentralized leaderboards and betting history stored on-chain.
- **Mobile Native**: Expanding to a progressive web app (PWA) for a native mobile experience.
