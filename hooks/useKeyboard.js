import { useCallback, useEffect, useState } from "react"

function actionByKey(key) {
	const keyActionMap = {
		KeyA: 'moveLeft',
		KeyD: 'moveRight',
	}
	return keyActionMap[key]
}

export const useKeyboard = () => {
	const [actions, setActions] = useState({
		moveLeft: false,
		moveRight: false,
	})

	const handleKeyDown = useCallback((e) => {
		const action = actionByKey(e.code)

        // console.log("test")

		if (action) {
			setActions((prev) => {
				return ({
					...prev,
					[action]: true
				})
			})
		}
	}, [])

	const handleKeyUp = useCallback((e) => {
		const action = actionByKey(e.code)
		
        // console.log("test")

		if (action) {
			setActions((prev) => {
				return ({
					...prev,
					[action]: false
				})
			})
		}
	}, [])

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('keyup', handleKeyUp)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('keyup', handleKeyUp)
		}
	}, [handleKeyDown, handleKeyUp])

	return actions
}