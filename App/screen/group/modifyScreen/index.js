import React, { useEffect, useState } from 'react';
import AppHeader from '../../../component/common/appHeader';
import GroupListboxWithStar from '../../../component/group/groupListboxWithStar';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import DraggableFlatList from 'react-native-draggable-flatlist';
import MyIcon from '../../../config/icon-font';
import { get } from 'lodash';
import { callApi } from '../../../function/auth';
import { postGroupsOrds } from '../../../api/group';
import Svg from '../../../asset/svg';

const GroupModifyScreen = ({ route }) => {
  const primaryData = get(route, 'params.data');
  const [groupData, setGroupData] = useState(primaryData);

  const handleOrder = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      console.log('변경성공');
    }
  };

  return (
    <Screen>
      <AppHeader
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
        title={'편집'}
      />

      <DraggableFlatList
        data={groupData}
        containerStyle={{ flex: 1 }}
        keyExtractor={(item, index) => `modify${index}`}
        onDragEnd={({ data }) => {
          setGroupData(data);
          let tempArray = [];
          let count = 0;
          data.forEach((e) => {
            count++;
            const array = { groupId: e.groupId, ord: count };
            tempArray.push(array);
          });
          const params = { groupList: tempArray };
          callApi(postGroupsOrds, params, handleOrder);
        }}
        renderItem={({ item, drag, isActive }) => (
          <GroupListboxWithStar
            arrow
            data={item}
            drag={drag}
            isActive={isActive}
          />
        )}
      />
    </Screen>
  );
};

export default GroupModifyScreen;
