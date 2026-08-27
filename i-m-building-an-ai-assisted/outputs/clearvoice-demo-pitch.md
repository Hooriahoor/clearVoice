# ClearVoice: Human-approved AI subtitle review

## Assumptions and scope

ClearVoice’s immediate problem is its backlog of recorded English talks, not live transcription. The organization values accuracy and brand protection above raw speed; every AI-generated translation must be reviewed by a human before it is published.

This working slice demonstrates a reviewer’s core workflow: choose a target language, inspect the original beside an AI first-pass translation, correct it, review named terms and quotations, approve each segment, and download an SRT file only after the full transcript is approved.

## What is real in the demo

- Editable subtitle segments with timing, speakers, search, review states, and four target-language views: Arabic, Urdu, Spanish, and French.
- Protected-content alerts for brand names, product names, and direct quotes.
- A publication gate: the publish button remains blocked until all segments are marked human-reviewed.
- Download of an approved SRT subtitle file.

## Deliberately faked or deferred

- The AI first-pass translations and confidence scores are sample data; a production version would call a translation API and retain the result and model version.
- Transcript import currently reads the file/text for the demo but does not parse it into segments.
- Video playback, login/roles, persisted project history, and real publishing are not implemented.
- Live captioning, speech-to-text, full branding, and a mobile app are deliberately deferred because they are not the immediate core need.

## Next steps

Connect SRT/VTT parsing and a translation service, save projects/revisions/approvals to a database, add reviewer permissions and an audit trail, then integrate actual video playback and a publishing destination.
