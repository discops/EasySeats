
const { AttestationService } = require('EAS_PROVIDER_LIBRARY');
const config = require('./eas.config.js'); 

async function submitAttestation(ticketData) {
  const attestationService = new AttestationService(config.apiKey); 

  try {
    const attestationRequest = {
      data: {
        ticketId: ticketData.id,
        eventId: ticketData.eventId,
        userId: ticketData.userId,
      },
    };

    const attestationResponse = await attestationService.submitAttestation(attestationRequest);

    if (attestationService.verifyAttestation(attestationResponse)) {
      console.log('Attestation successfully verified!');
    } else {
      console.error('Attestation verification failed!');
    }
  } catch (error) {
    console.error('Error during attestation:', error);
  }
}

module.exports = {
  submitAttestation,
};
