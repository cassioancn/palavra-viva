import io
from typing import Optional

def generate_verse_audio_bytes(text: str) -> Optional[bytes]:
    """Generate Portuguese speech audio bytes from text using gTTS."""
    if not text or not text.strip():
        return None
    try:
        from gtts import gTTS
        clean_text = text.replace("[", "").replace("]", "")
        tts = gTTS(text=clean_text, lang='pt', tld='com.br', slow=False)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp.read()
    except Exception:
        return None
