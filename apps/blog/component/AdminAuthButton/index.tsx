'use client'

import { Button, Label, Input } from '@common-ui'
import { toast } from 'sonner'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@common-ui'
import { LogIn, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
// import { useRouter } from 'next/navigation'

export const AdminAuthButton = ({ initialIsLoggedIn }: { initialIsLoggedIn: boolean }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loginInputs, setLoginInputs] = useState({ id: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const pathname = usePathname()
  // const router = useRouter()
  const handleLogin = () => {
    setErrorMessage('')
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginInputs),
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true)
          setDialogOpen(false)
          setErrorMessage('')
          // 홈페이지(/)에 있으면 서버 컴포넌트를 다시 렌더링하기 위해 페이지 새로고침
          if (pathname === '/') {
            // 새로고침후에도 toast를 표시하기 위해 sessionStorage에 저장
            sessionStorage.setItem('showLoginToast', 'true')
            window.location.reload()
          } else {
            toast.success('현우님 환영합니다!', {
              position: 'bottom-center',
            })
          }
        } else if (response.status === 401) {
          setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.')
        } else {
          setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.')
        }
      })
      .catch((error) => {
        setErrorMessage('로그인 실패: ' + error.message)
      })
  }

  const handleLogout = () => {
    fetch('/api/logout')
      .then(() => {
        setIsLoggedIn(false)
        // 홈페이지(/)에 있으면 서버 컴포넌트를 다시 렌더링하기 위해 페이지 새로고침
        if (pathname === '/') {
          // 새로고침 후에도 toast를 표시하기 위해 sessionStorage에 저장
          sessionStorage.setItem('showLogoutToast', 'true')
          window.location.reload()
        } else {
          toast.success('로그아웃되었습니다.', {
            position: 'bottom-center',
          })
        }
      })
      .catch((error) => {
        alert('로그아웃 실패: ' + error.message)
      })
  }


  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {!isLoggedIn ? (
          <DialogTrigger asChild>
            <Button size="icon" variant="secondary">
              <LogIn />
            </Button>
          </DialogTrigger>
        ) : (
          <Button size="icon" variant="secondary" onClick={handleLogout}>
            <LogOut />
          </Button>
        )}
        <DialogContent className="sm:max-w-[425px]" onClickCloseButton={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
            <DialogDescription>관리자 계정으로 로그인하세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="id">아이디</Label>
                <Input id="id" name="id" value={loginInputs.id} onChange={handleChangeInput} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  value={loginInputs.password}
                  onChange={handleChangeInput}
                  type="password"
                  required
                />
              </div>
              {errorMessage && <div className="text-sm text-red-600 dark:text-red-400">{errorMessage}</div>}
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
