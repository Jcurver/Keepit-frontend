import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { toSize } from '../../config/globalStyle';

import Page from './page';

export default function Carousel({ pages, pageWidth, gap, offset }) {
  const [page, setPage] = useState(0);

  function renderItem({ item }) {
    return (
      <Page
        item={item}
        style={{ width: pageWidth, marginHorizontal: gap / 2 }}
      />
    );
  }

  const onScroll = (e) => {
    const newPage = Math.round(
      e.nativeEvent.contentOffset.x / (pageWidth + gap),
    );
    setPage(newPage);
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <FlatList
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={{
            paddingHorizontal: offset + gap / 2,
          }}
          data={pages}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item, index) => `page__${index}`}
          onScroll={onScroll}
          pagingEnabled
          renderItem={renderItem}
          snapToInterval={pageWidth + gap}
          snapToAlignment="start"
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.indicatorWrapper}>
        {Array.from({ length: pages.length }, (_, i) => i).map((i) => (
          <View
            style={[
              styles.indicator,
              { backgroundColor: i === page ? '#00D282' : '#C4C4C4' },
            ]}
            key={`indicator_${i}`}
            focused={i === page}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    marginVertical: 6,
    marginHorizontal: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 16,
    // marginBottom: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: WINDOW_HEIGHT * 0.72,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
