import React, { useMemo } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { dropRight } from 'lodash-es';
import { QueryBucketItem } from '../shared/types';

interface TreeNode {
  name: string;
  children: TreeNode[];
}

/**
 * Folder Tree
 */
export const FolderTree: React.FC<{
  allObjects: QueryBucketItem[];
  onSelect: (prefix: string) => void;
}> = React.memo(({ allObjects, onSelect }) => {
  const tree = useMemo(() => {
    const _tree: TreeNode[] = [];
    allObjects.forEach((o) => {
      const name = o.name;
      const parts = dropRight(name.split('/'));

      let curLayer = _tree;
      for (const p of parts) {
        const findedNode = curLayer.find((item) => item.name === p);
        if (!findedNode) {
          // Not exist, create.
          const newNode = {
            name: p,
            children: [],
          };
          curLayer.push(newNode);
          curLayer = newNode.children;
        } else {
          curLayer = findedNode.children;
        }
      }
    });

    return _tree;
  }, [allObjects]);

  const renderTreeNodes = (nodes: TreeNode[], parentNames: string[] = []) => {
    return nodes.map((node) => {
      const prefixArr = [...parentNames, node.name];
      const prefix = prefixArr.join('/');
      return (
        <TreeItem
          key={prefix}
          nodeId={prefix}
          label={node.name}
          onClick={() => onSelect(prefix)}
        >
          {Array.isArray(node.children) &&
            node.children.length > 0 &&
            renderTreeNodes(node.children, prefixArr)}
        </TreeItem>
      );
    });
  };

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {renderTreeNodes(tree)}
    </TreeView>
  );
});
FolderTree.displayName = 'FolderTree';
