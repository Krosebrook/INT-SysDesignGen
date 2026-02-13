# Operational Runbook

## Incident Management

### Severity Levels
- **SEV-1**: System unusable (e.g., Gemini API down, Auth broken).
- **SEV-2**: Core feature degradation (e.g., PWA not caching, styles broken).
- **SEV-3**: Cosmetic issues or minor bugs.

## Troubleshooting Guides

### Scenario: "Synthesis Failed" Error
**Symptoms**: User sees red alert box during generation.
**Diagnosis**:
1. Check Browser Console for "Gemini API Error".
2. Verify `API_KEY` validity.
3. Check network connectivity.
**Resolution**:
- If 401/403: Rotate API Key.
- If 429: Rate limit exceeded. Wait or increase quota.

### Scenario: PWA Not Installing
**Symptoms**: "Install App" button never appears.
**Diagnosis**:
1. Verify site is served over HTTPS.
2. Check if `manifest.json` is loaded (Network tab).
3. Ensure user has not previously dismissed the prompt.
**Resolution**:
- Clear site data (Application Tab -> Clear Site Data).
- Reload page.

### Scenario: Login Loop
**Symptoms**: User keeps getting redirected to Login.
**Diagnosis**:
1. Check LocalStorage for `se_architect_session`.
2. Verify `lastLogin` timestamp validity.
**Resolution**:
- Manually clear LocalStorage to reset corrupted session state.
