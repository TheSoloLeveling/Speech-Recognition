$(document).ready(function () {

	var numSentences = 1;

	function getRandomInt(max) {
		min = 1;
		max++;
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	function getLocalStream() {
		navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
			window.localStream = stream; // A
			window.localAudio.srcObject = stream; // B
			window.localAudio.autoplay = true; // C
		}).catch( err => {
			console.log("u got an error:" + err)
		});
	}
	
	function randomString() {
		return Math.random().toString(36).substring(5);
	}

	function updateDataset() {
		$("#record").attr("disabled", false);
		$("#stop").attr("disabled", true);
		$("#nextSentence").attr("disabled", true);

		$.get('num_sentences.php',
			{ ds: $('#dataset').val() }
		).done(function (data) {
			numSentences = parseInt(data, 10);
			$('#sentenceNumber').val(getRandomInt(numSentences));
			updateSentence();
		});
	}

	function updateSentence() {
		$('#sentence').val('');
		$.get('sentence.php',
			{ ds: $('#dataset').val(), num: $('#sentenceNumber').val() }
		).done(function (data) {
			$('#sentence').empty().append(data);
		});
	}

	function updateFieldSet() {
		//generate random ID for the user
		$("#name").val(randomString() + randomString());
		$(document).on("input", "#dataset", updateDataset);
		$(document).on("input", "#sentenceNumber", updateSentence);

		$.get('datasets.php', function (data) {
			$('#dataset').empty().append(data);
			updateDataset();
		});
	}

	$("#signal").click(function () {
		$.get('signal.php',
			{ ds: $('#dataset').val(), sen: document.getElementById('sentence').textContent}
		).done(function (data) {
			alert(data);
			updateFieldSet();
		});
	});

	$("#skip").click(function () {
		$('#sentenceNumber').val(getRandomInt(numSentences));
		updateFieldSet();
		$("#record").attr("disabled", false);
		$("#stop").attr("disabled", true);
		$("#nextSentence").attr("disabled", true);
	});

	//generate random ID for the user
	$("#name").val(randomString() + randomString());
	$(document).on("input", "#dataset", updateDataset);
	$(document).on("input", "#sentenceNumber", updateSentence);
	getLocalStream()
	$.get('datasets.php', function (data) {
		$('#dataset').empty().append(data);
		updateDataset();
	});

	if (navigator.mediaDevices) {
		var constraints = { audio: true };
		var chunks = [];
		var blob = null;
		var clipName = "";

		navigator.mediaDevices.getUserMedia(constraints)
			.then(function (stream) {

				var mediaRecorder = new MediaRecorder(stream);

				$("#record").click(function () {
					$("#preview").trigger("stop");
					chunks = [];
					mediaRecorder.start();
					$("#record").attr("disabled", true);
					$("#stop").attr("disabled", false);
					$("#nextSentence").attr("disabled", true);
				});

				$("#stop").click(function () {
					mediaRecorder.stop();
					$("#record").attr("disabled", false);
					$("#stop").attr("disabled", true);
					$("#nextSentence").attr("disabled", false);
				});

				$("#nextSentence").click(function () {
					var xhr = new XMLHttpRequest();
					xhr.onload = function (e) {
						if (this.readyState === 4) {
							console.log("Server returned: ", e.target.responseText);
						}
					};
					var fd = new FormData();
					fd.append("ds", $('#dataset').val());
					fd.append("num", parseInt($('#sentenceNumber').val(), 10) - 1);
					fd.append("name", $('#name').val());
					fd.append("audio", blob, clipName);
					xhr.open("POST", "upload.php", false);
					xhr.send(fd);
	
					$('#sentenceNumber').val(getRandomInt(numSentences));
					updateFieldSet()
					
					$("#record").attr("disabled", false);
					$("#stop").attr("disabled", true);
					$("#nextSentence").attr("disabled", true);
					
					
				});

				mediaRecorder.onstop = function (e) {

					clipName = $("#dataset").val() + "_" + $("#sentenceNumber").val();

					blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
					chunks = [];
					var audioURL = URL.createObjectURL(blob);
					$("#preview").attr("src", audioURL);

					if ($("#autoplay").is(":checked"))
						$("#preview").trigger("play");
				}

				mediaRecorder.ondataavailable = function (e) {
					chunks.push(e.data);
				}
			})
			.catch(function (err) {
				alert('The following error occurred: ' + err);
			})
	}

});