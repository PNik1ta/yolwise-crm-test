"use client";

import type { ReactElement } from "react";

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): ReactElement {
	console.error("Global error boundary:", error);

	return (
		<html lang="en">
			<body>
				<div className="app-root">
					<main className="app-main">
						<section className="error-page">
							<h1>Something went wrong</h1>
							<p>We hit an unexpected error. You can try again or go to login.</p>

							<div className="error-actions">
								<button className="primary-btn" type="button" onClick={reset}>
									Try again
								</button>

								<a className="secondary-btn" href="/login">
									Go to login
								</a>
							</div>

							<p className="error-details">
								{error.message}
							</p>
						</section>
					</main>
				</div>
			</body>
		</html>
	);
}
