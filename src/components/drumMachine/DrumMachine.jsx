import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import slider from './slider.module.css';
import toggleSwitch from './switch.module.css';
import { FaPowerOff } from "react-icons/fa";
import keys from '../assets/constants/keys';

const PowerButton = ({ status, onClick }) => {
	const isOn = status === 'on';
	const buttonStyle = isOn ? styles.on : styles.off;

	return (
		<div className={`${styles.powerButton} ${buttonStyle}`} onClick={() => onClick()}>
			<FaPowerOff />
		</div>
	)
}

const DrumPads = ({ status, bank, clickedButtons, onClick }) => {
	return Object.keys(keys).map((key) => {
		const sound = keys[key]['sound'][bank];
		const isClicked = clickedButtons[key];
		const drumPadStyle = isClicked ? styles.clicked : styles.normal;
		const backgroundColor = isClicked && status === 'on' ? keys[key].backgroundColor : 'rgb(230, 230, 230)';

		return (
			<div id={keys[key]['text'][bank]} key={keys[key]['text'][bank]}
				className={`drum-pad ${styles.drumPad} ${drumPadStyle}`} style={{ backgroundColor }}
				onClick={() => onClick(key, event)}>
				<audio id={key} className='clip' src={`/sounds/${sound}`}>Your browser does not support the audio element.</audio>
				{key}
			</div>
		)
	})
}

const BankControl = ({ bank, onClick }) => {
	const position = bank === 1 ? toggleSwitch.left : toggleSwitch.right
	return (
		<div className={toggleSwitch.select}>
			<div className={`${toggleSwitch.inner} ${position}`} onClick={() => onClick()} />
		</div>
	)
}

const VolumeControl = ({ value, onChange }) => {
	return (
		<input className={slider.slider} type='range' min='0' max='100' step='1' value={value} onChange={(e) => onChange(e.target.value)} />
	)
}

const DrumMachine = () => {

	const [powerStatus, setPowerStatus] = useState("on");
	const [displayString, setDisplayString] = useState("");
	const [clickedButtons, setClickedButtons] = useState({});
	const [volume, setVolume] = useState(50);
	const [bank, setBank] = useState(1);

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.repeat) return;
			const key = e.key.toUpperCase();

			if (key in keys)
				handleClick(key);
		}

		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		}
	}, [powerStatus, volume, keys, bank]);

	useEffect(() => {
		setDisplayString(powerStatus === 'on' ? 'Power on' : 'Power off');

		setTimeout(() => {
			setDisplayString("");
		}, 1000)

	}, [powerStatus])

	const handleClick = (key) => {
		setClickedButtons((prev) => ({ ...prev, [key]: !prev[key] }));

		const audio = document.getElementById(key);

		if (powerStatus === 'on' && audio) {
			setDisplayString(keys[key]['text'][bank]);
			audio.volume = volume / 100;
			audio.pause();
			audio.currentTime = 0;
			audio.play();
		}

		setTimeout(() => {
			setClickedButtons((prev) => ({ ...prev, [key]: !prev[key] }));
		}, 100)
	}

	const handlePowerClick = () => {
		setPowerStatus((prevStatus) => prevStatus === 'on' ? 'off' : 'on');
	}

	const adjustVolume = (volume) => {
		setVolume(volume);
		if (powerStatus === 'on')
			setDisplayString(`Volume: ${volume}`);
	}

	const switchBank = () => {
		setBank(prevBank => {
			const newBank = prevBank === 1 ? 2 : 1;
			if (powerStatus === 'on') {
				setDisplayString(`Bank: ${newBank}`);
			}
			return newBank;
		});
	}

	return (
		<div id="drum-machine" className={`${styles.drumMachine}`}>
			<div className={styles.logoContainer}>
				<p className={styles.logo}>Drum Machine</p>
			</div>
			<div className={styles.header}>
				<div id="display" className={styles.display}>
					<p>{displayString}</p>
				</div>
				<PowerButton status={powerStatus} onClick={handlePowerClick} />
			</div>
			<div className={styles.drumPadContainer}>
				<DrumPads status={powerStatus} bank={bank} clickedButtons={clickedButtons} onClick={handleClick} />
			</div>
			<div className={styles.controlsContainer}>
				<div className={styles.controlContainer}>
					<BankControl bank={bank} onClick={switchBank} />
					<div className={styles.controlsLabelContainer}>
						<p className={styles.controlsLabel}>Bank</p>
					</div>
				</div>
				<div className={styles.controlContainer}>
					<VolumeControl value={volume} onChange={adjustVolume} />
					<div className={styles.controlsLabelContainer}>
						<p className={styles.controlsLabel}>Volume</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DrumMachine;