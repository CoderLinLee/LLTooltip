# LLTooltip：TS写的简单弹框组件

#### 1、使用,包裹要显示的内容就可以了

```tsx
<LLTooltip
    popContent={() => {
        return <React.Fragment>
            <Text numberOfLines={0}
                style={{ maxWidth: 200 }}
            >
                {"我是谁，我在哪里，我在哪里，我在哪里，我在哪里，我在哪里，我在哪里，我在哪里，我在哪里，我在哪里，我在哪里"}
            </Text>
        </React.Fragment>
    }}
    overlayColor='rgba(1,1,1,0.4)'
    style={{ marginLeft: 8 }}
	arrow={<View style={{width:30,height:50,backgroundColor:'yellow'}}></View>}
>
    <Text>点击</Text>
</LLTooltip>
```

#### 2、效果

![img](https://github.com/xiaohu036/PopView/blob/master/1.gif)





