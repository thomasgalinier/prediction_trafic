import React, { useState } from "react";
import './App.css';

const App = () => {
	// State pour le formulaire
	const [formData, setFormData] = useState({
		holiday: "",
		temp: "",
		rain_1h: "",
		snow_1h: "",
		clouds_all: "",
		weather_main: "",
		weather_description: "",
		day: "",
		month: "",
		year: "",
		hour: "",
	});

	// State pour les messages d'erreur et la prédiction
	const [prediction, setPrediction] = useState(null);
	const [error, setError] = useState(null);

	// State pour la validation des champs
	const [formErrors, setFormErrors] = useState({});

	// Gérer la saisie des données
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Validation du formulaire
	const validateForm = () => {
		const errors = {};
		if (!formData.holiday) errors.holiday = "Le champ Holiday est requis";
		if (formData.temp === "" || isNaN(formData.temp)) errors.temp = "La température est requise et doit être un nombre";
		if (formData.rain_1h === "" || isNaN(formData.rain_1h)) errors.rain_1h = "La pluie doit être un nombre";
		if (formData.snow_1h === "" || isNaN(formData.snow_1h)) errors.snow_1h = "La neige doit être un nombre";
		if (formData.clouds_all === "" || isNaN(formData.clouds_all)) errors.clouds_all = "Le pourcentage de nuages doit être un nombre";
		if (!formData.weather_main) errors.weather_main = "Le champ Weather Main est requis";
		if (!formData.weather_description) errors.weather_description = "Le champ Weather Description est requis";
		if (formData.day === "" ) errors.day = "Le jour doit être un nombre entre 1 et 31";
		if (formData.month === "" || isNaN(formData.month) || formData.month < 1 || formData.month > 12) errors.month = "Le mois doit être un nombre entre 1 et 12";
		if (formData.year === "" || isNaN(formData.year) || formData.year < 1900 || formData.year > 2100) errors.year = "L'année doit être un nombre entre 1900 et 2100";
		if (formData.hour === "" || isNaN(formData.hour) || formData.hour < 0 || formData.hour > 23) errors.hour = "L'heure doit être un nombre entre 0 et 23";

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Soumettre le formulaire
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation avant l'envoi des données
		if (!validateForm()) {
			return;
		}

		try {
			// Envoi des données à l'API FastAPI
			const response = await fetch("http://localhost:8000/predict", {
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
			if(response.ok) {
				const {prediction: data} = await response.json();
				setPrediction(data)
			} else {
				throw new Error('Erreur lors de la prédiction.')
			}
			setError(null);
		} catch (err) {
			setError("Erreur lors de la prédiction.");
			setPrediction(null);
		}
	};

	return (
		<div className="App">
			<h1>Prédiction Météorologique</h1>

			<form onSubmit={handleSubmit} className="form-container">
				<div className="form-groups">
					<div className="form-group">
						<label>Holiday:</label>
						<input
							type="text"
							name="holiday"
							value={formData.holiday}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.holiday && <p className="error">{formErrors.holiday}</p>}
					</div>
					<div className="form-group">
						<label>Temperature (°C):</label>
						<input
							type="number"
							name="temp"
							value={formData.temp}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.temp && <p className="error">{formErrors.temp}</p>}
					</div>
				</div>
				<div className="form-groups">

					<div className="form-group">
						<label>Rain (1 hour, mm):</label>
						<input
							type="number"
							name="rain_1h"
							value={formData.rain_1h}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.rain_1h && <p className="error">{formErrors.rain_1h}</p>}
					</div>

					<div className="form-group">
						<label>Snow (1 hour, mm):</label>
						<input
							type="number"
							name="snow_1h"
							value={formData.snow_1h}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.snow_1h && <p className="error">{formErrors.snow_1h}</p>}
					</div>
				</div>
				<div className="form-groups">
					<div className="form-group">
						<label>Clouds All (%):</label>
						<input
							type="number"
							name="clouds_all"
							value={formData.clouds_all}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.clouds_all && <p className="error">{formErrors.clouds_all}</p>}
					</div>

					<div className="form-group">
						<label>Weather Main:</label>
						<input
							type="text"
							name="weather_main"
							value={formData.weather_main}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.weather_main && <p className="error">{formErrors.weather_main}</p>}
					</div>
				</div>
				<div className="form-groups">
					<div className="form-group">
						<label>Weather Description:</label>
						<input
							type="text"
							name="weather_description"
							value={formData.weather_description}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.weather_description && <p className="error">{formErrors.weather_description}</p>}
					</div>

					<div className="form-group">
						<label>Day (1-31):</label>
						<input
							type="text"
							name="day"
							value={formData.day}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.day && <p className="error">{formErrors.day}</p>}
					</div>
				</div>
				<div className="form-groups">

					<div className="form-group">
						<label>Month (1-12):</label>
						<input
							type="number"
							name="month"
							max={12}


							value={formData.month}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.month && <p className="error">{formErrors.month}</p>}
					</div>

					<div className="form-group">
						<label>Year (e.g. 2024):</label>
						<input
							type="number"
							name="year"
							value={formData.year}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.year && <p className="error">{formErrors.year}</p>}
					</div>
				</div>
					<div className="form-group">
						<label>Hour (0-23):</label>
						<input
							type="datetime-local"
							name="hour"
							value={formData.hour}
							onChange={handleChange}
							className="input"
						/>
						{formErrors.hour && <p className="error">{formErrors.hour}</p>}
					</div>

					<button type="submit" className="submit-btn">Obtenir Prédiction</button>
			</form>

			{error && <p className="error">{error}</p>}

			{prediction !== null && (
				<div className="prediction">
					<h2>Trafic Prédiction</h2>
					<p>{prediction}</p>
				</div>
			)}
		</div>
	);
};

export default App;
