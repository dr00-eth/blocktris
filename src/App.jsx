import { useState } from 'react'
import './App.css'
import WalletConnect from './components/WalletConnect'
import Game from './components/Game'
import Marketplace from './components/Marketplace'
import useWallet from './hooks/useWallet'

function App() {
  const [activeTab, setActiveTab] = useState('game')
  const wallet = useWallet()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-400">BlockTris</h1>
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'game' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveTab('game')}
            >
              Game
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'marketplace' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveTab('marketplace')}
            >
              Marketplace
            </button>
          </div>
          <WalletConnect wallet={wallet} />
        </div>
      </header>

      <main className="container mx-auto p-4">
        {!wallet.isConnected ? (
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-2xl mb-4">Welcome to BlockTris</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Connect your wallet to play Tetris on the blockchain, create NFT games, 
              and trade completed game boards.
            </p>
            <button 
              className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
            >
              {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet to Play'}
            </button>
          </div>
        ) : !wallet.isCorrectNetwork ? (
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-2xl mb-4">Wrong Network</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Please switch to the Base network to play BlockTris.
            </p>
            <button 
              className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
              onClick={wallet.switchToCorrectNetwork}
            >
              Switch to Base Network
            </button>
          </div>
        ) : (
          <div>
            {activeTab === 'game' && <Game wallet={wallet} />}
            {activeTab === 'marketplace' && <Marketplace wallet={wallet} />}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>BlockTris - A blockchain-enhanced Tetris game on Base</p>
          <p className="text-sm mt-1">
            <span className="text-yellow-400">Note:</span> This is a prototype version without blockchain integration.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
