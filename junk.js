// JUNK CODE, ARCHIVED CODE

// // TWICE#100#-100 == avancer
// // TWICE#-100#100 == reculer

// function getOrientationFromPosition(targetPosition) {
// 	let degreeFromX = Math.atan2(targetPosition.y, targetPosition.x) * 57.29578
// 	degreeFromX = 90 - (degreeFromX)
// 	return parseFloat(degreeFromX.toFixed(2))
// }

// // helper also
// function waitFor(conditionFunction) {
//   const poll = resolve => {
//     if(conditionFunction()) resolve();
//     else setTimeout(_ => poll(resolve), 400);
//   }
//   return new Promise(poll);
// }


// // get the gyro promise and async
// function getAngleZ(Arduino)
// {
// 	return new Promise((resolve, reject) => {
// 		// resolved = false
// 		//Arduino.write('RGYRO\n')
// 		Arduino.write('ANGLEZ\n')
// 		setTimeout(() => {
//     		if (lastResponse.responseType === 'G') {
// 				resolve(lastResponse.payload.replace('G', ''))
// 			}
// 		}, 200)
// 	})
// }

// // return if true or false the device is in the right position
// // accuracy of 1 cm
// function checkPosition(targetPosition) {
// 	// var deltaX = targetPosition.x - realPosition.x
// 	var deltaY = targetPosition.y - realPosition.y
// 	// console.log(deltaY)
// 	// console.log(deltaX)
// 	// (-1 < deltaX && deltaX < 1) && 
// 	return (-1 < deltaY && deltaY < 1)
// }

// let isRightPosition = false

// function stopIfRightPosition(device, position) {
// 	if (checkPosition(position)) {
// 		device.write('STOPALL\n')
// 		isRightPosition = true
// 	} else {
// 		setTimeout(() => {
// 			stopIfRightPosition(device, position)
// 		}, 4)
// 	}
// }

// // goTo a relative position
// function goToInternal(device, position, targetPosition) {
// 	console.log('GoTo Intenal called')
// 	return new Promise((resolve, reject) => {
// 		targetOrientation = getOrientationFromPosition(targetPosition)
// 		console.log('TARGET ORIENTATION: ' + targetOrientation)

// 		goToOrientationInternal(device, targetOrientation).then(() => {
// 			console.log('good orientation')
// 			device.write('TWICE#50#-50\n')
// 			stopIfRightPosition(device, position)
// 			waitFor(() => isRightPosition).then(() => {
// 				console.log('good position')
// 				resolve(true)
// 			})
// 		})
// 	})
// }

// // compute a new temporary position from a targetPosition an A offset position
// function convertToInternalPosition(offsetPosition, targetPosition)
// {
// 	return {
// 		x: targetPosition.x,
// 		y: offsetPosition.y + 5
// 	}
// }

// let isRightGlobalPosition = false

// function goToLoop(device, targetPosition, count) {

// 	position = convertToInternalPosition(realPosition, targetPosition)
// 	isRightPosition = false
// 	console.log(position.y)
// 	goToInternal(device, position, targetPosition).then(() => {
// 		console.log('Go To internal completed')
// 		count = count++
// 		goToLoop(device, targetPosition, count)
// 	})
// }

// function goTo(device, position) {
// 	console.log('GoTO global called')
// 	return new Promise((resolve, reject) => {
// 		goToLoop(device, position, 0)	
// 		waitFor(() => isRightGlobalPosition).then(() => {
// 			console.log('good GLOBAL position')
// 			resolve(true)
// 		})
// 	})
// }


// // ORIENTATION

// function senseForOrientation(targetOrientation = 180) {
// 	if (targetOrientation === 180) {
// 		return 'right'
// 	} else {
// 		if (targetOrientation > 0 && targetOrientation < 180) {
// 			return 'right'
// 		} else {
// 			return 'left'
// 		}
// 	}
// }

// let isRightOrientation = false

// function checkOrientation(device, targetOrientation) {
// 	return new Promise((resolve) => {
// 		getAngleZ(device).then(angle => {
// 			targetOrientation = targetOrientation
// 			angle = angle
// 			// console.log('----')
// 			// console.log(targetOrientation)
// 			// console.log(angle)
// 			var deltaZ = targetOrientation - angle
// 			// console.log(deltaZ)
// 			// console.log('----')
// 			// resolve(deltaZ > -3 && deltaZ < 3)
// 			resolve(deltaZ < 3)
// 		})
// 	})
// }

// function stopIfRightOrientation(device, targetOrientation) {
// 	checkOrientation(device, targetOrientation).then(response => {
// 		if (response) {
// 			device.write('STOPALL\n')
// 			isRightOrientation = true
// 		} else {
// 			setTimeout(() => {
// 				stopIfRightOrientation(device, targetOrientation)
// 			}, 50)
// 		}
// 	})
// }

// function goToOrientationInternal(device, orientation) {
// 	return new Promise((resolve, reject) => {
// 		var sense = senseForOrientation(orientation)
// 		if (sense == 'right') {
// 			device.write('TWICE#0#50\n')
// 		} else {
// 			device.write('TWICE#-50#0\n')
// 		}
// 		stopIfRightOrientation(device, orientation)
// 		waitFor(() => isRightOrientation).then(() => {
// 			resolve(true)
// 		})
// 	})
// }


// // function goToOrientationLoop(device, orientation) {
// // 	setTimeout(() => {

// // 	})
// // }


// function goToOrientation(device, orientation) {
// 	return new Promise((resolve, reject) => {
// 		goToOrientationInternal(device, orientation).then(() => {
// 			resolve(true)
// 		})
// 	})
// }


// function loopAngleZ(Arduino) {
// 	getAngleZ(Arduino).then(angle => {
// 		// console.log(angle)
// 	})
// 	setTimeout(() => {
// 		loopAngleZ(Arduino)
// 	}, 100)
// }

// // function called when the bot is mounted
// function onRobotMounted(Arduino) {
// 	goTo(Arduino, {x: 30, y: 80}).then(() => {
// 	   	console.log('position confirmed')
// 	})
// 	// Arduino.write('TWICE#100#-100')
// 	/*goToOrientation(Arduino, 90).then(() => {
// 		console.log('good orientation!')
// 	})*/

// 	//loopAngleZ(Arduino)
// 	//console.log(getOrientationFromPosition({x: 2, y: 2}))

// }

// function init() {
// 	serialPort.list(function (err, ports) {
// 	  if (err !== null) {
// 	    console.log('Error while getting the list of serialport')
// 	    console.log(err)
// 	  }

// 	  comName = ports.filter(item => item.productId === '7523')[0].comName

// 	  console.log('DEBUG: Arduino plugged on ' + comName)
// 	  const Arduino = serialPort(comName, {
// 	    baudRate: 9600
// 	  })

// 	  Arduino.on('data', function (data) {
// 	    lastResponse = parseResponse(data)
// 	    //console.log(lastResponse)
// 	  })

// 	  setTimeout(() => { 
// 		  Arduino.write('PING\n', function(err) {
// 		     if (err) {
// 		        console.log('Error on write: ', err.message)
// 		        process.exit()
// 		     }
// 		     Arduino.write('INIT\n')
// 		     setTimeout(() => {
// 		     	onRobotMounted(Arduino)
//      		 }, 1000)	
// 		  })
// 		}, 1000)
// 	})
// }

// init()