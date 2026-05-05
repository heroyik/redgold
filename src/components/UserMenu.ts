
import { User } from 'firebase/auth';
import { signInWithGoogle, logout } from '../utils/auth';

class UserMenu extends HTMLElement {
  private _user: User | null = null;
  private _isOpen: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set user(user: User | null) {
    this._user = user;
    this.render();
  }

  toggleMenu() {
    this._isOpen = !this._isOpen;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  private async handleLogin() {
    const user = await signInWithGoogle();
    if (user) {
      this.dispatchEvent(new CustomEvent('auth-change', { 
        detail: { user },
        bubbles: true,
        composed: true
      }));
    }
  }

  private async handleLogout() {
    await logout();
    this._isOpen = false;
    this.dispatchEvent(new CustomEvent('auth-change', { 
      detail: { user: null },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          font-family: 'Outfit', sans-serif;
        }

        .auth-btn {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(139, 0, 0, 0.1);
          border-radius: 999px;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 800;
          color: #8B0000;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 0, 0, 0.12);
          border-color: #DAA520;
        }

        .auth-btn:active {
          transform: translateY(0);
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f0f0f0;
          border: 1px solid #DAA520;
          object-fit: cover;
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 200px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 0, 0, 0.08);
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
          padding: 0.75rem;
          display: ${this._isOpen ? 'block' : 'none'};
          z-index: 1000;
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .user-info {
          padding: 0.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          margin-bottom: 0.5rem;
        }

        .user-name {
          font-weight: 800;
          font-size: 0.9rem;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.7rem;
          color: #666;
          font-weight: 500;
        }

        .menu-item {
          padding: 0.6rem 0.8rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #444;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .menu-item:hover {
          background: rgba(139, 0, 0, 0.05);
          color: #8B0000;
        }

        .logout-item {
          color: #d9534f;
        }

        .logout-item:hover {
          background: rgba(217, 83, 79, 0.05);
          color: #c9302c;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: ${this._isOpen ? 'block' : 'none'};
          z-index: 999;
        }
      </style>

      ${this._user ? `
        <button class="auth-btn" id="user-btn">
          <img src="${this._user.photoURL || ''}" class="user-avatar" alt="">
          <span>${this._user.displayName?.split(' ')[0] || 'User'}</span>
        </button>
        <div class="overlay" id="menu-overlay"></div>
        <div class="dropdown">
          <div class="user-info">
            <div class="user-name">${this._user.displayName}</div>
            <div class="user-email">${this._user.email}</div>
          </div>
          <div class="menu-item logout-item" id="logout-btn">
            <span>Sign Out</span>
          </div>
        </div>
      ` : `
        <button class="auth-btn" id="login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
          </svg>
          <span>Sign In</span>
        </button>
      `}
    `;

    this.setupListeners();
  }

  private setupListeners() {
    const loginBtn = this.shadowRoot?.getElementById('login-btn');
    const userBtn = this.shadowRoot?.getElementById('user-btn');
    const logoutBtn = this.shadowRoot?.getElementById('logout-btn');
    const overlay = this.shadowRoot?.getElementById('menu-overlay');

    if (loginBtn) {
      loginBtn.onclick = () => this.handleLogin();
    }
    if (userBtn) {
      userBtn.onclick = () => this.toggleMenu();
    }
    if (logoutBtn) {
      logoutBtn.onclick = () => this.handleLogout();
    }
    if (overlay) {
      overlay.onclick = () => {
        this._isOpen = false;
        this.render();
      };
    }
  }
}

customElements.define('redgold-user-menu', UserMenu);
