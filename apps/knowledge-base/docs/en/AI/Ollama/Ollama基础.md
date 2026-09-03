Ollama is a tool for locally deploying large language models (LLM). It encapsulates model downloading, management, inference, and API services, allowing developers to run AI models locally as easily as using Docker.

Its main goals are:
- Run models with one command
- No need to configure complex environments like CUDA, Transformers, GGUF
- Provide a unified API for easy development

Installation:

```
curl -fsSL https://ollama.com/install.sh | sh
```

### List Models

```
ollama list

# Example output
NAME            ID              SIZE      MODIFIED
qwen3:latest    500a1f067a9f    5.2 GB    2 hours ago
llama3.2:3b     8fdf8f752f6e    2.0 GB    1 day ago
```

### Download Models

Download specified models from Ollama's official model library to local. Once downloaded, they can be used offline.

```
# Download default latest version
ollama pull qwen3

# Download models with specific parameter count/feature versions
ollama pull deepseek-r1:7b
ollama pull gemma3:4b-instruct-q4_K_M
```

### Run Models

Run process:
- **First run**: If the model is not found locally, it will automatically download, then load and enter the chat interface.
- **Subsequent runs**: Directly load from local. Loading speed depends on hardware performance (VRAM / memory read/write speed).
- **Chat mode**: After entering the terminal interactive interface, simply type questions and press Enter to get model responses. Multi-turn conversation context is automatically maintained by default.

```
ollama run qwen3

# Single-line execution mode
ollama run qwen3 "Explain what a large language model is in one sentence"
```

In the chat interface, you can use built-in commands to perform common operations:

- `/bye` or shortcut `Ctrl + D`: Exit chat and terminate current model process.
- `/reset`: Clear current conversation context and start a new conversation without exiting.
- `/help`: View all built-in interaction commands and parameter descriptions.
- `/set parameter <parameter name> <value>`: Temporarily adjust generation parameters, e.g., `/set parameter temperature 0.7`.

### Delete Models

Delete specified local model files to free up disk space.

```
ollama rm qwen3
```

### View Model Information

Output includes:

- Parameter count: The scale of model parameters (e.g., 7B, 14B), which directly determines the model's capability ceiling and hardware resource usage.
- Context Window: The maximum number of tokens the model can process at once, determining conversation memory length and text processing scale.
- License: The open-source license corresponding to the model, defining boundaries for commercial use and secondary distribution.
- Template: The prompt template for model conversations, defining formatting rules for user input, system prompts, and model responses.
- System Prompt: The default system prompt built into the model, determining the model's basic behavior and role setting.
- Modelfile: Complete model configuration file content, can be exported for custom models.
- Quantization method: Model quantization precision (e.g., Q4_K_M, Q8_0). Lower quantization levels mean smaller size and faster running speed, but with slight loss in generation quality.

```
ollama show qwen3
```

### Start API Service

Start Ollama's API service in the foreground, providing standard RESTful interfaces for applications and development frameworks to call local models.

```
ollama serve
```

Default listening address:

```
http://localhost:11434
```

Core interfaces: Include `/api/chat` (multi-turn conversation), `/api/generate` (text generation), `/api/tags` (list local models), etc. Native streaming response support.

### Configuration Files

All data is stored in the hidden folder `.ollama` under the user directory by default. Paths vary slightly across systems:

| System | Default Path | Description |
| ------- | ----------- | ----------- |
| macOS | `~/.ollama` | Hidden folder under user home directory |
| Windows | `C:\Users\<username>\.ollama` | Equivalent to `%USERPROFILE%\.ollama` |
| Linux (user installation) | `~/.ollama` | Used when manually starting the service |
| Linux (system installation via official script) | `/usr/share/ollama/.ollama` | Default path for systemd service |

You can customize the model storage directory via the environment variable `OLLAMA_MODELS` to migrate to a non-system disk and free up space.

The file structure under the root `.ollama` directory is roughly as follows:

```
.ollama/
├── models/                # Core: Model storage directory (99%+ of disk space)
│   ├── blobs/             # Binary weight files (actual model data)
│   └── manifests/         # Model metadata manifests (index files)
├── history                # Local interactive conversation history
├── id_ed25519             # Private key file (for private registry authentication, model signing)
├── id_ed25519.pub         # Public key file
└── logs/
    └── server.log         # Ollama background service runtime logs
```

Core directory: models/

This is Ollama's most core storage directory. All downloaded models are managed here, divided into `blobs` and `manifests`.

(1) blobs/ — Actual model data layer:
- Core directory for storing actual model data in Ollama, designed with content-addressable storage. All files in the directory are named in the format `sha256-<hash value>`, and the filename itself is the SHA256 hash checksum of the corresponding file content.
- Stores not only core GGUF model weight files but also model prompt templates, open-source licenses, default generation parameters, system prompts, and all configuration content. Each item is stored as an independent blob layer file.
- The most core feature is automatic deduplication. Multiple models in the same series share completely identical base data layers. Identical blob files are only kept once locally, significantly saving disk space.
- When deleting a model, only blob files no longer referenced by any model are cleaned up. Files still in use by other models are preserved.

(2) manifests/ — Model metadata manifests:
- Responsible for storing metadata manifests for all models. Officially downloaded models are stored under `manifests/registry.ollama.ai/library/<model name>/<tag>`.
- Each model tag corresponds to a JSON-format manifest file, recording which blob data layers the corresponding model is composed of. It contains the hash value, file type, and file size of each layer, along with complete metadata such as model architecture and running parameters.
- Management commands like `ollama list` and `ollama show` read information from this directory instead of directly parsing large model weight files, ensuring efficient management operations.

### Custom Models

`Modelfile` is Ollama's model definition file, similar to Docker's Dockerfile. It declares the model's base source, system prompts, inference parameters, and other configurations through instructions.

Create a new file without extension named `Modelfile` in the local directory, and write the following content:

```
# Declare base model: Build based on the latest version of qwen3
FROM qwen3:latest

# Solidify system prompt: Automatically injected in each conversation, permanently effective
SYSTEM """
You are a software architect with 20 years of experience.

Answer requirements:
- Use Chinese only
- Prioritize code
- Explain the reason for each step
"""

# Model inference hyperparameter configuration
PARAMETER temperature 0.2
PARAMETER num_ctx 32768
```

Enter the directory where `Modelfile` is located in the terminal and execute the create command:

```
ollama create my-qwen -f Modelfile
```

- `my-qwen`: The name of the custom model, can be modified. Use this name when running the model later.
- `-f Modelfile`: Specify the configuration file path. If not in the current directory, fill in the complete absolute path, e.g., `-f D:\OllamaModels\Modelfile`.