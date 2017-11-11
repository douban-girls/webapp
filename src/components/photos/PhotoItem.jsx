import React from 'react'
import styled from 'styled-components'
import Preview from '../preview/Preview'
import { getRealSrcLink } from '../../utils/index'

const Container = styled.picture`
  flex-grow: 1;
  img {
    width: 100%;
  }
`

class PhotoItem extends React.PureComponent {

  state = {
      visiable: false
  }

  togglePreview = () => {
    console.log(this.state)
    this.setState(ps => ({ visiable: !ps.visiable }))
  }

  componentDidCatch(err, info) {
    console.error(err, info)
  }

  render() {
    const { id, src, desc } = this.props
    const bmiddleSrc = getRealSrcLink(src)
    const previewData = this.state.visiable ? { id, src, desc } : null
    return (
      <Container onClick={() => { this.setState({ visiable: ! this.state.visiable })}}>
        <source srcSet={bmiddleSrc} />
        <img src={bmiddleSrc} alt={desc} />
        {/*<span>{desc}</span>*/}
        <Preview data={previewData} />
      </Container>
    )
  }
}

export default PhotoItem
