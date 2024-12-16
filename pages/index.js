import { useState } from "react";

export default function Home() {
    const [walletAddress, setWalletAddress] = useState("");
    const [message, setMessage] = useState("");
    const [signature, setSignature] = useState("");
    const [response, setResponse] = useState("");

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Metamask is not installed!");
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        try {
            const address = await signer.getAddress();
            setWalletAddress(address);

            const msg = "Sign this message to verify wallet ownership.";
            const sign = await signer.signMessage(msg);

            setMessage(msg);
            setSignature(sign);
        } catch (err) {
            console.error("Wallet connection error:", err);
        }
    };

    const verifySignature = async () => {
        try {
            const res = await fetch("/api/verify-signature", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress, message, signature }),
            });
            const result = await res.json();
            setResponse(result.message);
        } catch (err) {
            console.error("Verification error:", err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Wallet Verification</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            <p>Wallet Address: {walletAddress}</p>
            <button onClick={verifySignature}>Verify Wallet</button>
            <p>Response: {response}</p>
        </div>
    );
}