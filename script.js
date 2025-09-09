
    const myVideo = document.getElementById('my-video');
    const theirVideo = document.getElementById('their-video');
    const myIdDisplay = document.getElementById('my-id');
    const callBtn = document.getElementById('call-btn');
    const startBtn = document.getElementById('start-btn');
    const startContainer = document.getElementById('start-container');
    let localStream;
    let peer;

    // Step 1: Request camera/mic on button click
    async function startVideoChat() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        myVideo.srcObject = localStream;
        initPeer();
        startContainer.style.display = "none"; // hide start button
      } catch (err) {
        alert("Error accessing camera/microphone: " + err.message);
      }
    }

    // Step 2: Initialize PeerJS with short ID
    function initPeer() {
      const customId = Math.random().toString(36).substring(2, 8);
      peer = new Peer(customId);

      peer.on('open', id => {
        myIdDisplay.textContent = id;
        callBtn.disabled = false;
      });

      peer.on('call', call => {
        call.answer(localStream);
        call.on('stream', remoteStream => {
          theirVideo.srcObject = remoteStream;
        });
      });

      peer.on('error', err => {
        alert("PeerJS error: " + err.type);
      });
    }

    // Step 3: Make a call
    function callPeer() {
      const peerId = document.getElementById('peer-id').value.trim();
      if (!peerId) return alert("Please enter a Peer ID to call.");
      if (!localStream) return alert("Camera and microphone not ready yet!");

      const call = peer.call(peerId, localStream);
      if (!call) return alert("Call could not be started. Check Peer ID.");

      call.on('stream', remoteStream => {
        theirVideo.srcObject = remoteStream;
      });
    }

    // Event listeners
    startBtn.addEventListener('click', startVideoChat);
    callBtn.addEventListener('click', callPeer);