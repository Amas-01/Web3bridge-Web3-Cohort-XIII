import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Toaster } from "sonner";

const AppLayout = ({ children }) => {

    return (
        <div className="w-full h-full">
            <header className="h-20 bg-amber-100 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <span>LoGo</span>
                    <div className="flex gap-4 items-center">
                        <ConnectButton />
                       
                    </div>
                </div>
            </header>
            <main className="min-h-[calc(100vh-10rem)] w-full">
                <div className="container mx-auto">{children}</div>
            </main>
            <footer className="h-20 bg-amber-100 p-4">
                <div className="container mx-auto">
                    &copy; cohort xiii {new Date().getFullYear()}
                </div>
            </footer>
            <Toaster />
        </div>
    );
};

export default AppLayout;
