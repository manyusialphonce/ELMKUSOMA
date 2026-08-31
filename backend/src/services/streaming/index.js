const { RtcTokenBuilder, RtcRole } = require('agora-token');

/**
 * Wraps Agora's official `agora-token` npm package (published by Agora
 * themselves) so the rest of the codebase depends on this one function,
 * not directly on the Agora SDK. Requires AGORA_APP_ID and
 * AGORA_APP_CERTIFICATE from the Agora console, set in .env.
 *
 * Token generation is a pure local cryptographic operation — no network
 * call to Agora is made or needed here.
 */
function generateAgoraToken({ channelName, uid, isPublisher, expireSeconds = 3600 }) {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    throw new Error('AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in .env to generate a streaming token.');
  }

  const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const now = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = now + expireSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId, appCertificate, channelName, uid, role, expireSeconds, privilegeExpiredTs
  );

  return { token, appId, channelName, uid, expiresAt: privilegeExpiredTs };
}

/**
 * Provider-agnostic entry point used by controllers. Only "agora" is wired
 * up for real; add a "hundred_ms" branch here (or a sibling file) if you
 * switch providers later — callers never need to change.
 */
function generateStreamingCredentials({ liveClassId, userId, isPublisher }) {
  const provider = process.env.STREAMING_PROVIDER || 'agora';

  if (provider !== 'agora') {
    throw new Error(`Streaming provider "${provider}" is not yet implemented.`);
  }

  return {
    provider: 'agora',
    ...generateAgoraToken({
      channelName: `live-class-${liveClassId}`,
      uid: userId,
      isPublisher,
    }),
  };
}

module.exports = { generateStreamingCredentials };
