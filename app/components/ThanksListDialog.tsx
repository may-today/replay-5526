import type React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'

const ThanksListDialog: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-background/60 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="mx-0 text-report-base">感谢名单</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto">
          <article className="max-h-[50vh] overflow-y-auto leading-normal">
            <p className="my-4">
              「五月天 5525+1 年度报告」为粉丝作品，不代表相信音乐行为和立场。该报告由{' '}
              <a className="underline" href="https://ddiu.io" rel="noopener" target="_blank">
                Diu
              </a>{' '}
              制作并在小红书宣发。
            </p>
            <p className="my-4">以下是特别感谢名单：</p>
            <ul className="list-inside list-disc">
              <li>
                感谢由台湾老师维护的{' '}
                <a
                  className="underline"
                  href="https://docs.google.com/spreadsheets/d/1pvDc5SmF6Rsw2chkiZkNn6I4JJDleRVLb5yOKAbm8Ck"
                  rel="noopener"
                  target="_blank"
                >
                  「五月天MayDay演唱會歌單」
                </a>{' '}
                表格；
              </li>
              <li>专辑及嘉宾图片来自互联网</li>
              <li>「专属回忆」环节来自于小红书全体 wmls</li>
            </ul>
            <p className="my-4">技术信息：</p>
            <ul className="list-inside list-disc">
              <li>
                源代码：
                <a className="underline" href="https://github.com/may-today/replay-5526" rel="noopener" target="_blank">
                  may-today/replay-5526
                </a>
              </li>
              <li>
                字体：思源宋体 |{' '}
                <a className="underline" href="https://chinese-font.netlify.app/zh-cn/" rel="noopener" target="_blank">
                  中文网字计划
                </a>
              </li>
            </ul>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ThanksListDialog
