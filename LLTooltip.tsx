/*
 * @Author: your name
 * @Date: 2021-03-19 16:28:21
 * @LastEditTime: 2021-04-14 18:23:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /AwesomProject的副本/js/Common/LLTooltip.js
 */

import React, { ReactElement } from 'react';
import {
    View, Modal, TouchableOpacity, NativeModules,
    findNodeHandle, Dimensions, Animated,
    ViewStyle, GestureResponderEvent
} from "react-native";

enum ArrowDirection { top, left, right, bottom };

const ScreenMargin: number = 10
const TipMargin: number = 5

interface FrameRect {
    x: number,
    y: number,
    width: number,
    height: number,
}

interface LLTooltipContainnerProps {
    arrow?: ReactElement,
    direction: ArrowDirection,
    childLayout: FrameRect
    containerStyle?: ViewStyle
}

const LLTooltipContainner: React.FC<LLTooltipContainnerProps> = (props) => {
    const { childLayout, direction, containerStyle, arrow } = props
    const children = props.children
    const { customArrow, customArrowStyle } = getCustomArrow()
    const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0, load: false });
    const { containerLayout, arrowLayout } = layoutItem()

    function getCustomArrow() {
        if (arrow !== undefined) {
            let customArrow = arrow
            let customArrowStyle = customArrow.props.style
            return { customArrow, customArrowStyle }
        }
        return {}
    }

    function getArrowSize() {
        switch (direction) {
            case ArrowDirection.top:
            case ArrowDirection.bottom:
                return { width: 25, height: 10 }
            default:
                return { width: 10, height: 25 }
        }
    }

    function layoutItem() {
        let containerLayout = { x: 0, y: 0 }
        let arrowLayout = { x: 0, y: 0 }
        if (containerSize.load == false) {
            return { containerLayout: { x: -10000, y: -10000 }, arrowLayout }
        }
        let arrowSize = getArrowSize()
        if (customArrowStyle !== undefined) {
            const { width, height } = customArrowStyle
            arrowSize = { width, height }
        }
        const { width, height } = Dimensions.get('window')
        let diff = 0
        switch (direction) {
            case ArrowDirection.bottom:
                //正常值
                containerLayout = {
                    x: (childLayout.x + childLayout.width / 2) - containerSize.width / 2,
                    y: childLayout.y + childLayout.height + TipMargin
                }
                arrowLayout = { x: containerSize.width / 2 - arrowSize.width / 2, y: 0 }

                //偏移值
                if (containerLayout.x < ScreenMargin) { //左边边界偏移
                    diff = containerLayout.x - ScreenMargin
                } else if (containerLayout.x + containerSize.width > width - ScreenMargin) { //友边
                    diff = (width - ScreenMargin) - (containerLayout.x + containerSize.width)
                }
                containerLayout.x += diff
                arrowLayout.x -= diff
                break;
            case ArrowDirection.top:
                //正常值
                containerLayout = {
                    x: (childLayout.x + childLayout.width / 2) - containerSize.width / 2,
                    y: childLayout.y - containerSize.height - TipMargin - arrowSize.height
                }
                arrowLayout = { x: containerSize.width / 2 - arrowSize.width / 2, y: 0 }

                //偏移值
                if (containerLayout.x < ScreenMargin) { //左边边界偏移
                    diff = containerLayout.x - ScreenMargin
                } else if (containerLayout.x + containerSize.width > width - ScreenMargin) { //友边
                    diff = (width - ScreenMargin) - (containerLayout.x + containerSize.width)
                }
                containerLayout.x += diff
                arrowLayout.x -= diff

                break;
            case ArrowDirection.right:
                //正常值
                containerLayout = {
                    x: (childLayout.x + childLayout.width) + TipMargin,
                    y: childLayout.y - containerSize.height / 2 + childLayout.height / 2
                }
                arrowLayout = { x: 0, y: containerSize.height / 2 - arrowSize.height / 2 }

                //偏移值
                if (containerLayout.y < ScreenMargin) { //左边边界偏移
                    diff = containerLayout.y - ScreenMargin
                } else if (containerLayout.y + containerSize.width > height - ScreenMargin) { //友边
                    diff = (width - ScreenMargin) - (containerLayout.y + containerSize.width)
                }
                containerLayout.y += diff
                arrowLayout.y -= diff
                break;
            case ArrowDirection.left:
                //正常值
                containerLayout = {
                    x: (childLayout.x - containerSize.width - arrowSize.width) - TipMargin,
                    y: childLayout.y - containerSize.height / 2 + childLayout.height / 2
                }
                arrowLayout = { x: 0, y: containerSize.height / 2 - arrowSize.height / 2 }

                //偏移值
                if (containerLayout.y < ScreenMargin) { //左边边界偏移
                    diff = containerLayout.y - ScreenMargin
                } else if (containerLayout.y + containerSize.width > height - ScreenMargin) { //友边
                    diff = (width - ScreenMargin) - (containerLayout.y + containerSize.width)
                }
                containerLayout.y += diff
                arrowLayout.y -= diff
                break;
            default:
                containerLayout = { x: childLayout.x, y: childLayout.y }
                arrowLayout = { x: 0, y: 0 }
                break;
        }
        return { containerLayout, arrowLayout }
    }

    function RenderArrow() {
        if (customArrow) {
            return <View
                style={{
                    marginTop: arrowLayout.y,
                    marginLeft: arrowLayout.x,
                }}
            >
                {customArrow}
            </View>
        }
        let arrowSize = getArrowSize()
        switch (direction) {
            case ArrowDirection.top:
                return <View style={{
                    width: 0,
                    height: 0,
                    borderColor: 'rgba(0,0,0,0)',
                    borderLeftWidth: arrowSize.width / 2,
                    borderRightWidth: arrowSize.width / 2,
                    borderTopWidth: arrowSize.height,
                    borderTopColor: 'white',
                    marginTop: arrowLayout.y,
                    marginLeft: arrowLayout.x,
                }}
                >
                </View>
            case ArrowDirection.bottom:
                return <View style={{
                    width: 0,
                    height: 0,
                    borderColor: 'rgba(0,0,0,0)',
                    borderLeftWidth: arrowSize.width / 2,
                    borderRightWidth: arrowSize.width / 2,
                    borderBottomWidth: arrowSize.height,
                    borderBottomColor: 'white',
                    marginTop: arrowLayout.y,
                    marginLeft: arrowLayout.x,
                }}
                >
                </View>
            case ArrowDirection.left:
                return <View style={{
                    width: 0,
                    height: 0,
                    borderColor: 'rgba(0,0,0,0)',
                    borderTopWidth: arrowSize.height / 2,
                    borderBottomWidth: arrowSize.height / 2,
                    borderLeftWidth: arrowSize.width,
                    borderLeftColor: 'white',
                    marginTop: arrowLayout.y,
                    marginLeft: arrowLayout.x,
                }}
                >
                </View>

            case ArrowDirection.right:
                return <View style={{
                    width: 0,
                    height: 0,
                    borderColor: 'rgba(0,0,0,0)',
                    borderTopWidth: arrowSize.height / 2,
                    borderBottomWidth: arrowSize.height / 2,
                    borderRightWidth: arrowSize.width,
                    borderRightColor: 'white',
                    marginTop: arrowLayout.y,
                    marginLeft: arrowLayout.x,
                }}
                >
                </View>
            default:
                return <View style={{
                    backgroundColor: 'blue',
                    width: 20,
                    height: 20,
                    marginTop: arrowLayout.y,
                    marginLeft: arrowLayout.x,
                }}>
                </View>
        }
    }


    function ArrowView() {
        return <View>
            {
                <RenderArrow />
            }
        </View>
    }

    function ContainnerView() {
        return <View style={{
            padding: 8,
            backgroundColor: 'white',
            borderRadius: 5,
            ...containerStyle
        }}
            onLayout={(e) => {
                const width = e.nativeEvent.layout.width
                const height = e.nativeEvent.layout.height
                if (containerSize.load == false) {
                    setContainerSize({ width, height, load: true })
                }
            }}
        >
            {children}
        </View>
    }

    function GenView() {
        switch (direction) {
            case ArrowDirection.top:
                return <View><ContainnerView /><ArrowView /></View>
            case ArrowDirection.bottom:
                return <View><ArrowView /><ContainnerView /></View>
            case ArrowDirection.left:
                return <View style={{ flexDirection: 'row' }}><ContainnerView /><ArrowView /></View>
            case ArrowDirection.right:
                return <View style={{ flexDirection: 'row' }}><ArrowView /><ContainnerView /></View>
            default:
                return <View><ArrowView /><ContainnerView /></View>;
        }
    }

    return (<TouchableOpacity
        activeOpacity={1}
        style={{
            position: 'absolute',
            top: containerLayout.y,
            left: containerLayout.x,
        }}>
        <GenView />
    </TouchableOpacity>)
}

type dismissAction = () => void;

interface LLTooltipProps {
    arrow?: ReactElement, //箭头
    direction?: ArrowDirection, //箭头方向
    outRegionClickDissmiss?: boolean,
    overlayColor?: string,
    containerStyle?: ViewStyle,
    style?: ViewStyle,
    popContent: (dismiss: dismissAction) => ReactElement
}

const LLTooltip: React.FC<LLTooltipProps> = (props) => {
    const { style } = props
    const { popContent, children, direction = ArrowDirection.top } = props
    const { containerStyle } = props
    const { overlayColor = 'rgba(0,0,0,0.5)' } = props
    const { outRegionClickDissmiss = true } = props
    const { arrow } = props
    const [childLayout, setChildLayout] = React.useState({ x: 0, y: 0, width: 0, height: 0, show: false });

    function childrenContentClick(e: GestureResponderEvent) {
        fadeIn()
        const handle = findNodeHandle(e.target);
        NativeModules.UIManager.measure(handle, (
            x: number, y: number,
            width: number, height: number,
            pageX: number, pageY: number
        ) => {
            setChildLayout((pre) => {
                return { x: pageX, y: pageY, width, height, show: true }
            })
        });
    }

    function dismiss() {
        fadeOut()
        setChildLayout((pre) => {
            return { ...pre, show: false }
        })
    }

    function outRegionClickDissmissAction() {
        if (outRegionClickDissmiss) {
            dismiss()
        }
    }

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true
        }).start();
    };

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start();
    };

    return (
        <React.Fragment>
            {
                popContent &&
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={childLayout.show}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={outRegionClickDissmissAction}
                        style={{
                            flex: 1,
                            backgroundColor: overlayColor,
                        }}
                    >
                        <LLTooltipContainner
                            childLayout={childLayout}
                            direction={direction}
                            containerStyle={containerStyle}
                            arrow={arrow}
                        >
                            {popContent(dismiss)}
                        </LLTooltipContainner>
                    </TouchableOpacity>
                </Modal>
            }
            <TouchableOpacity
                style={style}
                onPress={(e) => {
                    childrenContentClick(e)
                }}
            >
                {children}
            </TouchableOpacity>
        </React.Fragment>
    );
}

export default LLTooltip;