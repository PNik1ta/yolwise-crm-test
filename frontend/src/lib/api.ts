const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch<TResponse = any>(
	path: string,
	options: RequestInit = {},
): Promise<{ data: TResponse | null; status: number }> {
	const res = await fetch(`${API_URL}${path}`, {
		method: options.method ?? "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(options.headers ?? {}),
		},
		body: options.body,
	});

	let data: TResponse | null = null;

	try {
		data = (await res.json()) as TResponse;
	} catch {
		data = null;
	}

	return { data, status: res.status };
}
