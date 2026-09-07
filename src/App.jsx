import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './Structure';
import Index from './pages/Index';
import History from './pages/History';

export default function App() {

  	return <BrowserRouter>

		<Header />
	
		<Routes>

			<Route path="/" element={ <Index/> } />
			<Route path="/history" element={ <History /> } />

		</Routes>

		<Footer />
	
	</BrowserRouter>;

}