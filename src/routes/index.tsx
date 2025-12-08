import { LogCard } from '@/components/log-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

const LOGS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam interdum nisi eros, quis viverra turpis lacinia sed. Mauris sed quam nec purus tempor efficitur. Sed convallis, dui a condimentum sollicitudin, augue mi tincidunt ligula, quis laoreet ipsum dui non enim. Suspendisse commodo, massa quis pellentesque rutrum, nulla mi aliquet libero, ut suscipit sem lorem sed enim. Mauris sit amet tristique tortor, ac ultrices diam. Vivamus orci odio, mattis id mi eget, pellentesque accumsan est. Cras ut tristique tortor. Phasellus tincidunt et orci quis semper. Pellentesque lacus sem, faucibus vel mattis ut, dictum in ligula. Sed eu erat sed diam semper vehicula a volutpat orci. Nam massa mauris, ultricies vitae sollicitudin ultrices, eleifend id velit. Morbi sed fringilla lectus, sit amet dictum felis. Nunc ullamcorper sit amet ex ut hendrerit. Donec fermentum ante a lectus auctor, at venenatis diam tincidunt. ',
  'Suspendisse eget turpis id mi ullamcorper rutrum sit amet eget ante. Praesent fringilla hendrerit purus eget ultrices. Cras dapibus dui rutrum nisl dictum fermentum. Suspendisse in euismod sem, et euismod velit. Integer ut viverra massa. Pellentesque in pretium dolor, ac elementum ligula. Aenean et metus quis est faucibus tempor. Vestibulum aliquam blandit risus eu porta. Phasellus eu vulputate magna. Mauris massa tortor, congue eget pharetra ac, suscipit luctus mauris. In sit amet turpis a nibh laoreet pellentesque. ',
  'Quisque sodales, arcu id iaculis dapibus, mi tellus ultrices sapien, ac euismod ex est eu lacus. Donec sit amet porta nisi, id porttitor eros. Donec porta accumsan massa sit amet vestibulum. Quisque nisi erat, feugiat vitae nunc et, semper pretium sapien. Fusce volutpat lorem non dui aliquet malesuada. Fusce tincidunt nisl sollicitudin, porttitor metus at, maximus odio. Quisque id feugiat turpis. Curabitur aliquet sapien ac nibh luctus, a finibus neque scelerisque. In semper hendrerit nisl.',
]

function App() {
  return (
    <div className="flex flex-col w-full items-center">
      <LogCard date="07/12/25" logs={LOGS} />
    </div>
  )
}
