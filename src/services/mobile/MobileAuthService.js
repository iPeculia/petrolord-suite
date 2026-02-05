/**
 * Mobile Authentication Service
 * Simulation of mobile-specific auth flows like biometrics.
 */

export class MobileAuthService {
    static async login(username, password) {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (username === 'admin' && password === 'password') {
            return { token: 'mob-token-xyz', user: { id: 1, name: 'Mobile User' } };
        }
        throw new Error('Invalid credentials');
    }

    static async authenticateWithBiometric() {
        // Simulate FaceID/TouchID
        console.log('Scanning biometrics...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    static async refreshToken() {
        return 'new-mob-token-' + Date.now();
    }
}