import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useFetch } from '../hooks/useFetch';

/**
 * 文件夹树
 */
export const FolderTree: React.FC<{
  bucketName: string;
}> = React.memo(({ bucketName }) => {
  const { data } = useFetch(`/api/objects?bucket=${bucketName}`);

  if (!data) return <div>Loading...</div>;

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem nodeId="1" label="Applications">
        <TreeItem nodeId="2" label="Calendar" />
      </TreeItem>
      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="6" label="MUI">
          <TreeItem nodeId="8" label="index.js" />
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
});
FolderTree.displayName = 'FolderTree';
