import request from "superagent";

export const login = () => {
	return request
		.post("/api/v1/auth/signin/42")
		.then((res) => {
			return res.body;
		})
		.catch((err) => {
			return err;
		});
}