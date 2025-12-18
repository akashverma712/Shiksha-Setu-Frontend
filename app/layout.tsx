// src/app/layout.tsx
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Poppins, Montserrat } from 'next/font/google';
import { ThemeProvider } from './ThemeProvider';

const montserrat = Montserrat({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-montserrat',
	display: 'swap',
});

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-poppins',
	display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${montserrat.variable} ${poppins.variable}`}>
			<body className="font-sans min-h-screen bg-background">
				<ThemeProvider>
					{children}
					<elevenlabs-convai agent-id="agent_1001kbq27qjjeajtpb778dztghpw"></elevenlabs-convai>
					<script
						src="https://unpkg.com/@elevenlabs/convai-widget-embed"
						async
						type="text/javascript"></script>
					<script
						src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
						defer></script>
					<script
						src="https://files.bpcontent.cloud/2025/07/26/14/20250726145316-HL7LMT4C.js"
						defer></script>
					<Toaster position="top-right" />
				</ThemeProvider>
			</body>
		</html>
	);
}
