import { cloneDeep, keyBy } from 'lodash';

  
function groupByParents(array, options) {
    const arrayByID = keyBy(array, options.customID);
    return array.reduce((prev, item) => {
        let parentID = item[options.parentProperty];
        if (!parentID || !arrayByID.hasOwnProperty(parentID)) {
            parentID = options.rootID;
        }

        if (parentID && prev.hasOwnProperty(parentID)) {
            prev[parentID].push(item);
            return prev;
        }

        prev[parentID] = [item];
        return prev;
    }, {});
}

// 生成Tree
function createTree(array, rootNodes, customID, childrenProperty) {
    const tree = [];

    for (const rootNode in rootNodes) {
        if (!rootNodes[rootNode] && !rootNodes.hasOwnProperty(rootNode)) {
            continue;
        }
        const node = rootNodes[rootNode];
        const childNode = array[node[customID]];

        if (childNode) {
            node[childrenProperty] = createTree(
                array,
                childNode,
                customID,
                childrenProperty,
            );
        }

        tree.push(node);
    }

    return tree;
}

/*
 * 从tree转为Array
 */
export const treeToArray = (tree, list, parentPermissions) => {
    list = list || [];
    tree.map(item => {
        const permissions = {};
        if (item.redirectUrl && item.redirectUrl.indexOf('#/') >= 0) {
            if (item.children && item.children.length) {
                item.children.map(buttonItem => {
                    if (buttonItem.resourceType === 1) {
                        permissions[buttonItem.redirectUrl] = 1;
                    }
                });
            }
            if (item.resourceType === 1) {
                Object.assign(permissions, parentPermissions || {});
            }
            list.push({
                ...item,
                children: '',
                permissions,
            });
        }
    
        if (item.children && item.children.length) {
            return treeToArray(item.children, list, permissions);
        }
    });
    return list;
};

// 数组转树形结构
export const arrayToTree = (data, options) => {
    options = Object.assign(
        {
            parentProperty: 'parent_id',
            childrenProperty: 'children',
            customID: 'id',
            rootID: '0',
        },
        options,
    );
  
    if (!Array.isArray(data)) {
        throw new TypeError('Expected an array but got an invalid argument');
    }
  
    const grouped = groupByParents(cloneDeep(data), options);
    
    return createTree(
        grouped,
        grouped[options.rootID],
        options.customID,
        options.childrenProperty,
    );
}