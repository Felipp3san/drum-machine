import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { FaPowerOff } from "react-icons/fa";

const keys = {
	'Q': { 
		text: 'Heater 1', 
		backgroundColor: '#FF8A66', // Lighter by 30%
	},
	'W': { 
		text: 'Heater 2', 
		backgroundColor: '#FFB84D', // Lighter by 30%
	},
	'E': { 
		text: 'Heater 3', 
		backgroundColor: '#FFDC66', // Lighter by 30%
	},
	'A': { 
		text: 'Heater 4', 
		backgroundColor: '#E4F9D0', // Lighter by 30%
	},
	'S': { 
		text: 'Clap', 
		backgroundColor: '#66FF8F', // Lighter by 30%
	},
	'D': { 
		text: 'Open-HH', 
		backgroundColor: '#4CFFB8', // Lighter by 30%
	},
	'Z': { 
		text: "Kick-n'-Hat", 
		backgroundColor: '#66FFFF', // Lighter by 30%
	},
	'X': { 
		text: 'Kick', 
		backgroundColor: '#6699FF', // Lighter by 30%
		 // 30% opacity shadow
	},
	'C': { 
		text: 'Closed-HH', 
		backgroundColor: '#B966FF', // Lighter by 30%
	}
};

const PowerButton = ({status, onClick}) => {
	const isOn = status === 'on'; 
	const buttonStyle = isOn? styles.on : styles.off;

	return (
		<div className={`${styles.powerButton} ${buttonStyle}`} onClick={onClick}>
			<FaPowerOff />
		</div>
	)
}

const Buttons = ({status, clickedButtons, onClick}) => {
	return Object.keys(keys).map((key) => {
		const isClicked = clickedButtons[key]; 
		const buttonStyle = isClicked ? styles.clicked : styles.normal;
		const backgroundColor = isClicked && status === 'on'? keys[key].backgroundColor : 'rgb(230, 230, 230)';

		return (
			<div key={key} className={`${styles.buttons} ${buttonStyle}`} style={{ backgroundColor }} onClick={() => onClick(key)}>
				<p>{key}</p>
			</div>	
		)
	})
}

const DrumMachine = () => {

	const [powerStatus, setPowerStatus] = useState("off");
	const [visorString, setVisorString] = useState("");
	const [clickedButtons, setClickedButtons] = useState({});

	const handleClick = (key) => {
		setClickedButtons((prev) => ({...prev, [key]: !prev[key]}));

		if (powerStatus === 'on')
			setVisorString(keys[key].text);

		setTimeout(() => {
			setClickedButtons((prev) => ({...prev, [key]: !prev[key]}));
		}, 150)
	}

	const handlePowerClick = () => {
		setPowerStatus(() => powerStatus === 'on'? 'off' : 'on');		
	}

	useEffect(() => {
		setVisorString(powerStatus === 'on'? 'Power on' : 'Power off');

		setTimeout(() => {
			setVisorString("");
		}, 1000)

	}, [powerStatus])

	return (
		<div id="drum-machine" className={`${styles.drumMachine} ${styles.metal}`}>
			<div className={styles.header}>
				<div className={styles.visor}>
					<p>{visorString}</p>
				</div>
				<PowerButton status={powerStatus} onClick={handlePowerClick}/>
			</div>
			<div className={styles.buttonsContainer}>
				<Buttons status={powerStatus} clickedButtons={clickedButtons} onClick={handleClick}/>
			</div>
		</div>
	)
}

export default DrumMachine;