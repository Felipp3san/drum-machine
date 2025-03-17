import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import slider from './slider.module.css';
import metal from './metal.module.css';
import { FaPowerOff } from "react-icons/fa";

const keys = {
	'Q': {
		text: 'Heater 1',
		sound: 'Heater-1.mp3',
		backgroundColor: '#FF8A66',
	},
	'W': {
		text: 'Heater 2',
		sound: 'Heater-2.mp3',
		backgroundColor: '#FFB84D',
	},
	'E': {
		text: 'Heater 3',
		sound: 'Heater-3.mp3',
		backgroundColor: '#FFDC66',
	},
	'A': {
		text: 'Heater 4',
		sound: 'Heater-4_1.mp3',
		backgroundColor: '#E4F9D0',
	},
	'S': {
		text: 'Clap',
		sound: 'Heater-6.mp3',
		backgroundColor: '#66FF8F',
	},
	'D': {
		text: 'Open-HH',
		sound: 'Dsc_Oh.mp3',
		backgroundColor: '#4CFFB8',
	},
	'Z': {
		text: "Kick-n'-Hat",
		sound: 'Kick_n_Hat.mp3',
		backgroundColor: '#66FFFF',
	},
	'X': {
		text: 'Kick',
		sound: 'RP4_KICK_1.mp3',
		backgroundColor: '#6699FF',
	},
	'C': {
		text: 'Closed-HH',
		sound: 'Cev_H2.mp3',
		backgroundColor: '#B966FF',
	}
};

const PowerButton = ({ status, onClick }) => {
	const isOn = status === 'on';
	const buttonStyle = isOn ? styles.on : styles.off;

	return (
		<div className={`${styles.powerButton} ${buttonStyle}`} onClick={onClick}>
			<FaPowerOff />
		</div>
	)
}

const DrumPads = ({ status, clickedButtons, onClick }) => {
	return Object.keys(keys).map((key) => {
		const sound = keys[key]['sound'];
		const isClicked = clickedButtons[key];
		const drumPadStyle = isClicked ? styles.clicked : styles.normal;
		const backgroundColor = isClicked && status === 'on' ? keys[key].backgroundColor : 'rgb(230, 230, 230)';

		return (
			<div id={keys[key].text} key={keys[key].text}
				className={`drum-pad ${styles.drumPad} ${drumPadStyle}`} style={{ backgroundColor }}
				onClick={() => onClick(key, event)}>
				<audio id={key} className='clip' src={`src/assets/sounds/${sound}`}>Your browser does not support the audio element.</audio>
				{key}
			</div>
		)
	})
}

const VolumeControl = ({value, onChange}) => {
	return (
		<input className={slider.slider} type='range' min='0' max='100' step='1' value={value}  onChange={(e) => onChange(e.target.value)}/>
	)
}

const DrumMachine = () => {

	const [powerStatus, setPowerStatus] = useState("off");
	const [displayString, setDisplayString] = useState("");
	const [clickedButtons, setClickedButtons] = useState({});
	const [volume, setVolume] = useState(100);

	useEffect(() => {
		setDisplayString(powerStatus === 'on' ? 'Power on' : 'Power off');

		setTimeout(() => {
			setDisplayString("");
		}, 1000)

	}, [powerStatus])

	const handleClick = (key, event) => {
		setClickedButtons((prev) => ({ ...prev, [key]: !prev[key] }));

		const audio = event.target.children[0];
		if (powerStatus === 'on' && audio) {
			setDisplayString(keys[key].text);
			audio.volume = volume / 100;
			audio.pause();
			audio.currentTime = 0;
			audio.play();
		}

		setTimeout(() => {
			setClickedButtons((prev) => ({ ...prev, [key]: !prev[key] }));
		}, 150)
	}

	const handlePowerClick = () => {
		setPowerStatus(() => powerStatus === 'on' ? 'off' : 'on');
	}

	const adjustVolume = (volume) => {
		setVolume(volume);
		if (powerStatus === 'on')
			setDisplayString(`Volume: ${volume}`);
	}

	return (
		<div id="drum-machine" className={`${styles.drumMachine} ${metal.metal}`}>
			<div className={styles.header}>
				<div id="display" className={styles.display}>
					<p>{displayString}</p>
				</div>
				<PowerButton status={powerStatus} onClick={handlePowerClick} />
			</div>
			<div className={styles.drumPadContainer}>
				<DrumPads status={powerStatus} clickedButtons={clickedButtons} onClick={handleClick} />
			</div>
			<div className={styles.sliderContainer}>
				<VolumeControl value={volume} onChange={adjustVolume}/>
			</div>
		</div>
	)
}

export default DrumMachine;