class AuthManager {
  constructor() {
    this.user = null;
    this.listeners = [];
    this.loadUserFromStorage();
  }

  // Initialize from localStorage
  loadUserFromStorage() {
    const savedUser = localStorage.getItem('rpg-user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.notifyListeners();
    }
  }

  // Event listeners
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  // Traditional email/password authentication
  async registerWithEmail(email, password, username) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('rpg-users') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }

      const newUser = {
        id: 'user_' + Date.now(),
        email,
        username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        authMethod: 'email',
        createdAt: new Date().toISOString(),
        profile: {
          gamesCreated: 0,
          totalPlays: 0,
          followers: 0
        }
      };

      // Save to localStorage (in real app, this would be sent to backend)
      existingUsers.push({ ...newUser, passwordHash: this.hashPassword(password) });
      localStorage.setItem('rpg-users', JSON.stringify(existingUsers));
      
      return this.setCurrentUser(newUser);
    } catch (error) {
      throw error;
    }
  }

  async loginWithEmail(email, password) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem('rpg-users') || '[]');
      const user = users.find(u => u.email === email && u.passwordHash === this.hashPassword(password));
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return this.setCurrentUser(userWithoutPassword);
    } catch (error) {
      throw error;
    }
  }

  // Web3 wallet authentication
  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const address = accounts[0];
      
      // Get network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      // Check if user exists
      const users = JSON.parse(localStorage.getItem('rpg-users') || '[]');
      let user = users.find(u => u.walletAddress === address);

      if (!user) {
        // Create new user
        user = {
          id: 'wallet_' + Date.now(),
          walletAddress: address,
          chainId,
          username: `User_${address.slice(-6)}`,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
          authMethod: 'wallet',
          createdAt: new Date().toISOString(),
          profile: {
            gamesCreated: 0,
            totalPlays: 0,
            followers: 0
          }
        };

        users.push(user);
        localStorage.setItem('rpg-users', JSON.stringify(users));
      } else {
        // Update chain if changed
        user.chainId = chainId;
      }

      return this.setCurrentUser(user);
    } catch (error) {
      throw error;
    }
  }

  // Set current user
  setCurrentUser(user) {
    this.user = user;
    localStorage.setItem('rpg-user', JSON.stringify(user));
    this.notifyListeners();
    return user;
  }

  // Logout
  logout() {
    this.user = null;
    localStorage.removeItem('rpg-user');
    this.notifyListeners();
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is logged in
  isAuthenticated() {
    return !!this.user;
  }

  // Update user profile
  async updateProfile(updates) {
    if (!this.user) throw new Error('Not authenticated');

    try {
      const users = JSON.parse(localStorage.getItem('rpg-users') || '[]');
      const userIndex = users.findIndex(u => u.id === this.user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('rpg-users', JSON.stringify(users));
        
        this.user = { ...this.user, ...updates };
        localStorage.setItem('rpg-user', JSON.stringify(this.user));
        this.notifyListeners();
      }
      
      return this.user;
    } catch (error) {
      throw error;
    }
  }

  // Simple password hashing (in production, use proper hashing)
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  // Listen for wallet changes
  setupWalletListeners() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.logout();
        } else if (this.user && this.user.authMethod === 'wallet') {
          this.connectWallet();
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        if (this.user && this.user.authMethod === 'wallet') {
          this.updateProfile({ chainId });
        }
      });
    }
  }
}

// Initialize global auth manager
window.AuthManager = new AuthManager();
window.AuthManager.setupWalletListeners();