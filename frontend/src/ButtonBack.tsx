import { useNavigate } from 'react-router-dom';
import './ButtonBack.css';

const ButtonBack = () => {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			className="button-back"
			onClick={() => navigate('/')}
			aria-label="Volver al inicio"
			title="Volver al inicio"
		>
			<svg
				className="button-back__icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M3 10.5L12 3l9 7.5" />
				<path d="M5 10v10h5v-6h4v6h5V10" />
			</svg>
		</button>
	);
};

export default ButtonBack;
