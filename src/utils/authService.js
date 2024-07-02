const API_URL = `http://localhost:${import.meta.env.VITE_PORT}/api/auth/`;

class AuthService {
    async register(username, email, password) {
        await fetch(API_URL + "signup", {
            method: "POST",
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8",
            }),
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });
    }

    async login(username, password) {
        const data = await fetch(API_URL + "login", {
            method: "POST",
            headers: new Headers({
                "Content-type": "application/json; charset=UTF-8",
            }),
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(data));
                }

                console.log(data);

                return data;
            });

        return data;
    }

    async logout(userId) {
        localStorage.removeItem("user");

        await fetch(API_URL + "logout", {
            method: "DELETE",
            body: JSON.stringify({
                userId: userId,
            }),
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();
