# Codex Guide cho DanangBooth

File này là entrypoint cho team khi dùng AI trong repo này.

## 1. Repo này đã được setup gì

- `AGENTS.md`: luật làm việc chung cho agent
- `.codex/config.toml`: cấu hình Codex theo project
- `.codex/agents/*.toml`: các role chuyên biệt cho plan, review, docs, build fix
- `.agents/skills/**`: skill dùng lại cho frontend, Next.js, design system, accessibility, verification

## 2. Nếu dùng Codex

Chỉ cần mở repo này trong Codex app hoặc Codex CLI. Codex sẽ tự đọc:

- `AGENTS.md`
- `.codex/config.toml`
- `.codex/AGENTS.md`
- `.agents/skills/**`

### Role nên dùng

- `explorer`: đọc codebase trước khi sửa
- `planner`: bẻ nhỏ feature theo file thật
- `docs_lookup`: verify Next.js, React, Radix, Tailwind, SWR
- `code_reviewer` hoặc `reviewer`: soát regression
- `build_error_resolver`: fix build/type lỗi với diff nhỏ
- `tdd_guide`: task có behavior rõ và cần test

### Skill nên ưu tiên cho frontend

- `danangbooth-frontend`
- `danangbooth-ui-guardrails`
- `frontend-patterns`
- `nextjs-turbopack`
- `design-system`
- `accessibility`
- `verification-loop`

## 3. Nếu không dùng Codex

Team vẫn dùng được các file này với Cursor, Claude, ChatGPT, Gemini hoặc reviewer thủ công.

### Cách dùng tối thiểu

Đưa cho AI các file sau trước khi nhờ nó sửa:

- `AGENTS.md`
- `DESIGN.md`
- `src/app/globals.css`
- file route liên quan trong `src/app/**`
- feature folder liên quan trong `src/features/**`
- skill liên quan trong `.agents/skills/**`

### Prompt khởi đầu

Dùng mẫu ở `docs/ai/feature-extension-prompt.md`.

## 4. Quy ước mở rộng feature

1. Tìm route owner trong `src/app/**`.
2. Tìm feature owner trong `src/features/**`.
3. Reuse `src/components/ui/**` trước khi tạo shared component mới.
4. Chỉ đẩy state lên `src/store/**` khi nhiều screen thực sự dùng chung.
5. Không phá token, spacing, safe-area, `TopBar`, `BottomNav` nếu task không yêu cầu.

## 5. Cách đẩy lên git để team dùng ngay

Commit các thư mục và file sau:

- `.codex/`
- `.agents/`
- `CODEX_GUIDE.vi.md`
- `docs/ai/feature-extension-prompt.md`

Không cần cài global Codex config để dùng trong repo này. Project-local setup là đủ.
