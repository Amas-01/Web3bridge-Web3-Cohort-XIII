import { useConnect } from wagmi

const useWallet = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const connect = async () => {
        setIsConnecting(true);
        try {
            // In a real app, this would use wagmi's useConnect
            const result = await mockWeb3Provider.connect();
            setIsConnected(true);
            setAddress(result.address);
        } catch (error) {
            console.error("Connection failed:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        setIsConnected(false);
        setAddress(null);
        mockWeb3Provider.disconnect();
    };

    return { isConnected, address, connect, disconnect, isConnecting };
};