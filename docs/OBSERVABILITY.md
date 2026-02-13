# Observability & Monitoring

## Client-Side Logging
The application uses a structured logging approach for critical events.

- **Console**: Used for development debugging.
- **Audit Logs**: Critical security actions (Moderation, PII masking) are stored in `se_architect_moderation_audit`.

## Key Metrics to Watch

1. **Synthesis Failure Rate**: Track `Gemini API Error` occurrences in the console.
2. **PWA Install Rate**: Track `beforeinstallprompt` acceptance events.
3. **Session Duration**: Time between `signIn` and `signOut`.

## Alerting Thresholds (Conceptual)

If integrated with a telemetry tool (e.g., Sentry, Datadog):

- **Critical**: API Key invalid / missing.
- **High**: Rate limit hit > 10 times/hour for a single user.
- **Warning**: PWA Service Worker registration failure.
