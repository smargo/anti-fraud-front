import type { IApi } from '@umijs/max';
import { writeFileSync } from 'fs';
import path from 'path';

export default (api: IApi) => {
  const version = Date.now();
  api.onBuildComplete(() => {
    const versionFilePath = path.join(api.paths.absOutputPath, 'version.json');
    writeFileSync(versionFilePath, JSON.stringify({ version: version }));
  });
  api.modifyHTML(($: any) => {
    $('head').append(`<meta name="version" content="${version}">`);
    return $;
  });
};
