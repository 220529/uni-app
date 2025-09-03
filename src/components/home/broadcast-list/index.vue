<template>
  <view class="broadcast-list">
    <view class="list-header">
      <view class="header-title">工地播报</view>
      <view class="header-desc">实时了解施工进度</view>
    </view>
    
    <view class="broadcast-groups">
      <view 
        class="date-group"
        v-for="(group, groupIndex) in broadcastGroups"
        :key="group.date"
      >
        <!-- 日期标题 -->
        <view class="date-header" @click="toggleGroup(groupIndex)">
          <view class="date-info">
            <view class="date-text">{{ group.date }}</view>
            <view class="count-text">{{ group.items.length }}条播报</view>
          </view>
          <view class="expand-icon" :class="{ expanded: group.expanded }">
            <text>▼</text>
          </view>
        </view>
        
        <!-- 播报列表 -->
        <view class="broadcast-items" v-show="group.expanded">
          <view 
            class="broadcast-item"
            v-for="item in group.items"
            :key="item.id"
          >
            <view class="item-header">
              <view class="item-type" :class="item.typeClass">{{ item.type }}</view>
              <view class="item-time">{{ item.time }}</view>
            </view>
            
            <view class="item-content">
              <view class="item-remark">{{ item.remark }}</view>
              <view class="item-reporter">播报人：{{ item.reporter }}</view>
            </view>
            
            <!-- 图片/视频展示 -->
            <view class="item-media" v-if="item.media && item.media.length">
              <cpm-file-upload 
                :file-list="item.media"
                :readonly="true"
                :show-upload="false"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Props
const props = defineProps({
  // 是否为页面模式（完整页面）还是组件模式（首页嵌入）
  mode: {
    type: String,
    default: 'component', // 'component' | 'page'
  }
});

// 播报数据
const broadcastGroups = reactive([
  {
    date: '2024年1月15日',
    expanded: true,
    items: [
      {
        id: 1,
        type: '施工进度',
        typeClass: 'progress',
        time: '14:30',
        remark: '水电改造工程已完成，所有管线布置符合规范要求，可以进入下一阶段施工。',
        reporter: '张工程师',
        media: []
      },
      {
        id: 2,
        type: '材料到场',
        typeClass: 'material',
        time: '09:20',
        remark: '瓷砖、水泥等泥瓦工程材料已到场，质量检验合格。',
        reporter: '李监理',
        media: []
      }
    ]
  },
  {
    date: '2024年1月14日',
    expanded: false,
    items: [
      {
        id: 3,
        type: '安全检查',
        typeClass: 'safety',
        time: '16:45',
        remark: '安全员进行现场安全检查，确认施工环境安全，所有安全防护措施到位。',
        reporter: '王安全员',
        media: []
      }
    ]
  }
]);

// 切换分组展开/收起
const toggleGroup = (index) => {
  broadcastGroups[index].expanded = !broadcastGroups[index].expanded;
};
</script>

<style scoped lang="scss">
.broadcast-list {
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  
  .list-header {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    padding: 40rpx;
    text-align: center;
    color: white;
    
    .header-title {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    
    .header-desc {
      font-size: 28rpx;
      opacity: 0.9;
    }
  }
  
  .broadcast-groups {
    .date-group {
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .date-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx 40rpx;
        background: #f8f9fa;
        
        &:active {
          background: #e9ecef;
        }
        
        .date-info {
          .date-text {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 5rpx;
          }
          
          .count-text {
            font-size: 24rpx;
            color: #666;
          }
        }
        
        .expand-icon {
          font-size: 24rpx;
          color: #666;
          transition: transform 0.3s ease;
          
          &.expanded {
            transform: rotate(180deg);
          }
        }
      }
      
      .broadcast-items {
        .broadcast-item {
          padding: 30rpx 40rpx;
          border-bottom: 1rpx solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15rpx;
            
            .item-type {
              padding: 8rpx 16rpx;
              border-radius: 15rpx;
              font-size: 24rpx;
              
              &.progress {
                background: #d4edda;
                color: #155724;
              }
              
              &.material {
                background: #fff3cd;
                color: #856404;
              }
              
              &.safety {
                background: #cce5ff;
                color: #004085;
              }
            }
            
            .item-time {
              font-size: 24rpx;
              color: #999;
            }
          }
          
          .item-content {
            margin-bottom: 15rpx;
            
            .item-remark {
              font-size: 28rpx;
              color: #333;
              line-height: 1.6;
              margin-bottom: 10rpx;
            }
            
            .item-reporter {
              font-size: 24rpx;
              color: #666;
            }
          }
          
          .item-media {
            margin-top: 20rpx;
          }
        }
      }
    }
  }
}
</style>
