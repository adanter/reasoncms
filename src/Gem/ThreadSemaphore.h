/*-----------------------------------------------------------------
LOG
    GEM - Graphics Environment for Multimedia

	- locks a thread (wrapper around pthread's sem_t)

    Copyright (c) 2011 IOhannes m zmoelnig. forum::f�r::um�ute. IEM. zmoelnig@iem.at
    For information on usage and redistribution, and for a DISCLAIMER OF ALL
    WARRANTIES, see the file, "GEM.LICENSE.TERMS" in this distribution.

-----------------------------------------------------------------*/

#ifndef INCLUDE_GEM_THREADSEMAPHORE_H_
#define INCLUDE_GEM_THREADSEMAPHORE_H_


#include "Base/GemExportDef.h"

namespace gem { 
  namespace thread {
    GEM_EXTERN class Semaphore {
    private:
      class PIMPL;
      PIMPL*m_pimpl;
    public:
      Semaphore(void);
      virtual ~Semaphore(void);
      
      void freeze (void);
      void thaw   (void);
    };
  };
};
#endif /* INCLUDE_GEM_THREADSEMAPHORE_H_ */
