import type { ReactNode } from "react";
import "./globals.scss";

export const metadata = {
	title: "Yolwise CRM Test",
	description: "Simple CRM test app with auth",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div className="app-root">
					<header className="app-header">
						<div className="app-header-inner">
							<h1>Yolwise CRM Test</h1>
						</div>
					</header>
					<main className="app-main">{children}</main>
				</div>
			</body>
		</html>
	);
}
