from __future__ import annotations

import os
from pathlib import Path

from app.config import get_cors_origins, get_static_dir


def test_cors_origins_default_allow_all(monkeypatch) -> None:
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    assert get_cors_origins() == ["*"]


def test_cors_origins_parses_list(monkeypatch) -> None:
    monkeypatch.setenv("CORS_ORIGINS", "https://a.example, https://b.example")
    assert get_cors_origins() == ["https://a.example", "https://b.example"]


def test_static_dir_none_when_missing(monkeypatch, tmp_path: Path) -> None:
    missing = tmp_path / "nope"
    monkeypatch.setenv("STATIC_DIR", str(missing))
    assert get_static_dir() is None


def test_static_dir_returns_populated_directory(monkeypatch, tmp_path: Path) -> None:
    static = tmp_path / "static"
    static.mkdir()
    (static / "index.html").write_text("<html></html>", encoding="utf-8")
    monkeypatch.setenv("STATIC_DIR", str(static))
    assert get_static_dir() == static


def test_port_env_used_by_default_process(monkeypatch) -> None:
    monkeypatch.setenv("PORT", "9090")
    assert os.getenv("PORT") == "9090"
