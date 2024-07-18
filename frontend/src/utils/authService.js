const API_URL = `/${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/`;

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

                return data;
            })
            .catch((error) => {
                return error;
            });

        return data;
    }

    async logout(userId) {
        await fetch(API_URL + "logout", {
            method: "DELETE",
            headers: new Headers({
                Authorization: JSON.parse(localStorage.getItem("user"))
                    .accessToken,
                "Content-type": "application/json; charset=UTF-8",
            }),
            body: JSON.stringify({
                userId: userId,
            }),
        });

        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();
