let selectedChoice = "heads";
let userPublicKey = null;

const betAmountInput = document.getElementById("betAmount");
const btnHeads = document.getElementById("choiceHeads");
const btnTails = document.getElementById("choiceTails");
const betButton = document.getElementById("betButton");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletAddressDisplay = document.getElementById("walletAddress");
const resultArea = document.getElementById("resultArea");
const coinIcon = document.getElementById("coinIcon");
const resultText = document.getElementById("resultText");
const payoutInfo = document.getElementById("payoutInfo");
const txHash = document.getElementById("txHash");

async function connectWallet() {
    try {
        connectWalletBtn.textContent = "Connecting...";
        const freighterMod = await import('https://cdn.jsdelivr.net/npm/@stellar/freighter-api@2.0.0/+esm');
        const freighter = freighterMod.default || freighterMod;

        if (!(await freighter.isConnected())) {
            throw new Error("Freighter not found! Please install the Freighter extension.");
        }

        const pubKey = await freighter.requestAccess();
        if (!pubKey) throw new Error("Access denied. Please allow access in Freighter.");

        userPublicKey = pubKey;
        walletAddressDisplay.textContent = `${pubKey.substring(0, 6)}...${pubKey.substring(pubKey.length - 4)}`;
        walletAddressDisplay.classList.remove("hidden");
        connectWalletBtn.classList.add("hidden");
        
        // Save to session to persist during reload
        sessionStorage.setItem("toss_bet_user", pubKey);
        console.log("Connected:", pubKey);
    } catch (err) {
        console.error(err);
        alert("Wallet error: " + err.message);
        connectWalletBtn.textContent = "CONNECT WALLET";
    }
}

// Auto-connect if already authorized
async function initWallet() {
    const saved = sessionStorage.getItem("toss_bet_user");
    if (saved) {
        const freighterMod = await import('https://cdn.jsdelivr.net/npm/@stellar/freighter-api@2.0.0/+esm');
        const freighter = freighterMod.default || freighterMod;
        if (await freighter.isConnected()) {
            userPublicKey = saved;
            walletAddressDisplay.textContent = `${saved.substring(0, 6)}...${saved.substring(saved.length - 4)}`;
            walletAddressDisplay.classList.remove("hidden");
            connectWalletBtn.classList.add("hidden");
        }
    }
}

connectWalletBtn.addEventListener("click", connectWallet);
window.addEventListener("load", initWallet);

function select(choice) {
    selectedChoice = choice;
    if (choice === "heads") {
        btnHeads.classList.add("active");
        btnTails.classList.remove("active");
    } else {
        btnTails.classList.add("active");
        btnHeads.classList.remove("active");
    }
}

btnHeads.addEventListener("click", () => select("heads"));
btnTails.addEventListener("click", () => select("tails"));

async function placeBet() {
    const amount = parseFloat(betAmountInput.value);
    
    if (!userPublicKey) {
        alert("Please connect your wallet first!");
        connectWallet();
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid bet amount.");
        return;
    }

    try {
        betButton.disabled = true;
        betButton.textContent = "SIGNING...";
        resultArea.classList.add("hidden");

        // 1. Sign a mock transaction to "feel" like a real dApp (Reference: subs_remi)
        const freighterMod = await import('https://cdn.jsdelivr.net/npm/@stellar/freighter-api@2.0.0/+esm');
        const freighter = freighterMod.default || freighterMod;

        // Build a dummy transaction just for signing (doesn't get sent to network yet)
        const server = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");
        const account = await server.getAccount(userPublicKey);
        const tx = new StellarSdk.TransactionBuilder(account, { 
            fee: "100", 
            networkPassphrase: StellarSdk.Networks.TESTNET 
        })
        .addOperation(StellarSdk.Operation.payment({
            destination: userPublicKey, // Send to self (mock)
            asset: StellarSdk.Asset.native(),
            amount: "0.00001"
        }))
        .addMemo(StellarSdk.Memo.text(`Bet ${amount} on ${selectedChoice}`))
        .setTimeout(30)
        .build();

        const xdr = tx.toXDR();
        let signedXdr;
        try {
            const result = await freighter.signTransaction(xdr, "TESTNET");
            signedXdr = result.signedTxXdr || result;
        } catch (e) {
            throw new Error("Transaction signing cancelled or failed.");
        }

        if (!signedXdr) throw new Error("Signing failed");

        // 2. Call backend with the result of the "intent"
        betButton.textContent = "TOSSING...";
        const response = await fetch("http://127.0.0.1:8080/bet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                amount, 
                choice: selectedChoice,
                user: userPublicKey,
                signed_intent: signedXdr // Send the signed XDR as proof of intent
            })
        });

        if (!response.ok) throw new Error("Backend connection failed");

        const data = await response.json();

        // 3. Reveal result
        resultArea.classList.remove("hidden");
        coinIcon.textContent = data.result === "heads" ? "🟡" : "⚪";
        coinIcon.style.animation = "none";
        
        if (data.outcome === "win") {
            resultText.textContent = `YOU WON ${data.result.toUpperCase()}!`;
            resultText.style.color = "var(--win)";
            payoutInfo.textContent = `+${data.payout} XLM Payout`;
            payoutInfo.style.display = "block";
            // Extra punch for winning
            coinIcon.classList.add("pulse");
        } else {
            resultText.textContent = `OUTCOME: ${data.result.toUpperCase()}`;
            resultText.style.color = "var(--text-muted)";
            payoutInfo.textContent = `You lost ${amount} XLM. Try again!`;
            payoutInfo.style.color = "var(--lose)";
            payoutInfo.style.display = "block";
            coinIcon.classList.remove("pulse");
        }

        txHash.textContent = `Backend Ref: ${data.tx_hash}`;

    } catch (err) {
        console.error(err);
        alert(err.message || "Something went wrong!");
    } finally {
        betButton.disabled = false;
        betButton.textContent = "PLACE BET";
    }
}

betButton.addEventListener("click", placeBet);
