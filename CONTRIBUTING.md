# 贡献指南

感谢您考虑为 SearchBeam 项目做出贡献！以下是一些指导方针，帮助您参与到项目中来。

## 贡献流程

1. Fork 本仓库
2. 创建一个新分支：`git checkout -b feature/your-feature-name`
3. 进行代码修改
4. 确保通过所有测试：`npm test`
5. 提交您的更改：`git commit -m '添加了某某功能'`
6. 推送到分支：`git push origin feature/your-feature-name`
7. 提交 Pull Request

## 代码风格

- 使用 TypeScript 编写所有代码
- 遵循项目中的 ESLint 和 Prettier 规则
- 为所有新功能编写测试
- 保持代码注释清晰明确

## 拉取请求指南

- 每个 PR 应该专注于一个功能或修复
- 包含清晰的描述说明此 PR 解决了什么问题
- 如果更改与现有 issue 相关，请在 PR 描述中引用 issue 编号
- 所有 PR 必须通过 CI 测试才能合并

## 添加新的平台支持

如果您想添加对新视频平台的支持，请按照以下步骤：

1. 在`/src/api`目录下创建新文件，例如`newplatform.ts`
2. 实现符合统一接口的搜索功能
3. 添加平台特定的类型定义
4. 在`/services/searchService.ts`中注册新平台
5. 添加适当的测试
6. 更新文档

## 问题报告

如果您发现问题或有改进建议，请创建新的 issue，并尽可能提供：

- 清晰简洁的问题描述
- 重现步骤
- 预期结果与实际结果的对比
- 系统环境信息（Node.js 版本等）

## 许可

通过贡献代码，您同意您的贡献将在 MIT 许可下提供。
